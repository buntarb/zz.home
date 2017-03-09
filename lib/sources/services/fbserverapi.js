/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */


/**********************************************************************************************************************
 * Globals                                                                                                            *
 **********************************************************************************************************************/

var idk = require( 'imazzine-developer-kit' );
var https = require('https');

goog.provide( 'zz.home.services.FBServerApi' );

goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.json' );
goog.require( 'goog.array' );
goog.require( 'goog.Timer' );

goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.net.enums.MessageType' );
goog.require( 'zz.net.models.MessageDataset' );

goog.require( 'zz.home.services.DataToModel' );
goog.require( 'zz.home.enums.Command' );
goog.require( 'zz.home.enums.Const' );
goog.require( 'zz.home.models.FBServerApi' );


/**********************************************************************************************************************
 * Constructor                                                                                                        *
 **********************************************************************************************************************/

/**
 * FB api service class.
 * @param {string} url
 * @param {string} opt_protocol
 * @constructor
 */
zz.home.services.FBServerApi = function( url, opt_protocol ){

    /**
     * Web server.
     * @type {Object}
     * @private
     */
    this.webSrv_ = undefined;

    /**
     * Connections pool
     * @type {Arraya}
     * @private
     */
    this.sockets_ = [ ];

    /**
     * Flag if web server is running
     * @type {boolean}
     * @private
     */
    this.isRunning_ = false;

    /**
     * WebSocket client.
     * @type {zz.net.WebSocketClient}
     * @private
     */
    this.wsc_ = new zz.net.WebSocketClient( url, opt_protocol );

    /**
     * Service event handler.
     * @type {goog.events.EventHandler}
     * @private
     */
    this.eventHandler_ = new goog.events.EventHandler( );


    this.wsc_.addSupportedCommand( zz.home.enums.Command.GET_POSTS );
    this.wsc_.addSupportedCommand( zz.home.enums.Command.GET_DOCS );

    /**
     * Other Listeners
     */
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.net.enums.EventType.WEB_SOCKET_OPEN,
        this.openHandler_,
        false,
        this
    );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.net.enums.EventType.WEB_SOCKET_READY,
        this.readyHandler_,
        false,
        this
    );

    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.home.enums.Command.GET_POSTS,
        this.clientRequestToFBHandler_,
        false,
        this
    );

    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.home.enums.Command.GET_DOCS,
        this.clientRequestToFBHandler_,
        false,
        this
    );

    if( !this.isRunning_ ){

        this.startServer( this );
    }

    // goog.Timer.callOnce( function( ){
    //
    //     this.clientRequestToFBHandler_( );
    // }, 1000, this );
};


/**
 * Get data from fb handler.
 * @param  e
 * @private
 */
zz.home.services.FBServerApi.prototype.clientRequestToFBHandler_ = function( e ){

    if( e ){

        var dataset = new zz.net.models.MessageDataset( null, e.messageData );
        var datarow = dataset.firstDatarow( );
    }else{

        var dataset = new zz.net.models.MessageDataset( );
        var datarow = dataset.createLast( );
        datarow.command = zz.home.enums.Command.GET_DOCS;
    }

    var fbApiDataset = new zz.home.models.FBServerApi( );
    var fbApiDatarow = fbApiDataset.createLast( [ datarow.data ] );
    var request;

    switch( datarow.command ){

        case zz.home.enums.Command.GET_POSTS:

            request = '/feed?fields=full_picture,message,source&';

            break;

        case zz.home.enums.Command.GET_DOCS:

            request = '/docs?';

            break;
    }

    var postOptions = {

        protocol: 'https:',
        host: 'graph.facebook.com',
        path: '/v2.8/'
        + zz.home.enums.Const.FB_ID
        + request
        + 'access_token='
        + zz.home.enums.Const.ACCESS_TOKEN,
        method: 'GET'
    };

    var arrFeed = [ ];
    try{

        this.sendRequestToFB_( postOptions, arrFeed, fbApiDatarow.content, fbApiDataset, e );

    }catch( e ){

        console.log( e );
    }
};


/**
 * Send request to FB.
 * @param {Object} postOptions
 * @param {Array} arrFeed
 * @param {zz.home.models.Posts} model
 * @param {zz.home.models.FBServerApi} apiModel
 * @param wsEvent
 * @private
 */
zz.home.services.FBServerApi.prototype.sendRequestToFB_ = function( postOptions, arrFeed, model, apiModel, wsEvent ){
    
    var self = this;

    var postReq = https.request( postOptions, function( res ){

        self.fbResponseHandler_( res, arrFeed, model, apiModel, wsEvent );
    } );

    postReq.on( 'error', function( e ){

        console.log( 'problem with request: ' + e.message );
    });

    postReq.end( );
};

/**
 * FB feed response handler.
 * @param res
 * @param {Array} arrFeed
 * @param {zz.home.models.Posts} model
 * @param {zz.home.models.FBServerApi} apiModel
 * @param wsEvent
 * @private
 */
zz.home.services.FBServerApi.prototype.fbResponseHandler_ = function( res, arrFeed, model, apiModel, wsEvent ){

    // console.log( 'statusCode:', res.statusCode );
    //console.log( 'headers:', res.headers );
    if( wsEvent ){

        var dataset = new zz.net.models.MessageDataset( null, wsEvent.messageData );
        var datarow = dataset.firstDatarow( );
    }else{

        var dataset = new zz.net.models.MessageDataset( );
        var datarow = dataset.createLast( );
        datarow.command = zz.home.enums.Command.GET_DOCS;
    }
    var request;

    switch( datarow.command ){

        case zz.home.enums.Command.GET_POSTS:

            request = '/feed?fields=full_picture,message,source';

            break;

        case zz.home.enums.Command.GET_DOCS:

            request = '/docs';

            break;
    }
    var dataFB = "";
    var self = this;
    res.on( 'data', function( d ){

        process.stdout.write( d );
        dataFB += d;
    });

    res.on( "end", function( ){

        var feed = goog.json.parse( dataFB );

        // console.log( 'FEED !!!!!!!!@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', feed );
        // if( feed.data.length ){
        //
        //     var nextPage = feed.paging.next;
        //
            arrFeed = arrFeed.concat( feed.data );
        //
        //     // console.log( 'concat!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1', arrFeed );
        //
        //     var nextData = nextPage.slice(
        //
        //         nextPage.indexOf( 'limit=' ) - 1,
        //         nextPage.length
        //     );
        //
        //     var nextOptions = {
        //
        //         protocol: 'https:',
        //         host: 'graph.facebook.com',
        //         path: '/v2.8/'
        //         + zz.home.enums.Const.FB_ID
        //         + request
        //         + '&access_token='
        //         + zz.home.enums.Const.ACCESS_TOKEN
        //         + nextData,
        //         method: 'GET'
        //     };
        //
        //    self.sendRequestToFB_( nextOptions, arrFeed, model, apiModel, wsEvent );
        //
        // }else{


            //console.log( "array!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", arrFeed.length, arrFeed );
            //var sortedArr = zz.home.services.DataFilter.getInstance( ).sortDataByIdBubble( arrFeed );
            goog.array.forEach( arrFeed, function( item ){

                if( item.id.indexOf( '_' ) > 0 ){

                    item.id = item.id.slice( item.id.indexOf( '_' ) + 1, item.id.length );
                }
            });
            // goog.array.sort( arrFeed, function( a, b ){
            //
            //     return b.id - a.id;
            // } );
            zz.home.services.DataToModel.getInstance( ).FBDataToModel( arrFeed, model );

            var dataset = new zz.net.models.MessageDataset( null, wsEvent.messageData );
            var datarow = dataset.firstDatarow( );

            self.wsc_.sendMessage(

                zz.net.enums.MessageType.COMMAND,
                datarow.command,
                wsEvent.messageSource,
                apiModel
            );
        // }
    } );
};


/**
 * Start web server handler.
 * @param {?Object|undefined} this_ Context
 * @private
 */
zz.home.services.FBServerApi.prototype.startServer = function( this_ ){

    this_ = this_? this_: this;

    var ft = idk.filetools;
    var srvCfg = ft.openYaml( ft.getRootPath( ) + ft.CONST.PATH_DELIMITER + 'config.yaml' );

    this_.webSrv_ = idk[ 'server' ][ 'getWebServer' ]( );
    this_.webSrv_ = this_.webSrv_.listen( srvCfg[ 'FB' ][ 'SERVER_PORT' ] );

    var sockets = this_.sockets_;
    this_.webSrv_.on( 'connection', function( socket ){

        sockets.push( socket );
    });

    this_.isRunning_ = true;
};


/**
 * Service open event handler.
 * @private
 */
zz.home.services.FBServerApi.prototype.openHandler_ = function( ){ };

/**
 * Service ready event handler.
 * @private
 */
zz.home.services.FBServerApi.prototype.readyHandler_ = function( ){

    console.log( 'Service is ready as ' + this.wsc_.path_ );
};

/**********************************************************************************************************************
 * Exports                                                                                                            *
 **********************************************************************************************************************/

goog.exportSymbol( 'zz.home.services.FBServerApi', zz.home.services.FBServerApi );
var fb = new zz.home.services.FBServerApi( 'ws://localhost:7777' );