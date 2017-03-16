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

goog.require( 'zz.home.services.DataConverter' );
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
    this.wsc_.addSupportedCommand( zz.home.enums.Command.GET_IMAGES );

    /**
     * Other Listeners
     */
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.net.enums.EventType.WEB_SOCKET_OPEN,
        this.openListener_,
        false,
        this
    );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.net.enums.EventType.WEB_SOCKET_READY,
        this.readyListener_,
        false,
        this
    );

    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.home.enums.Command.GET_POSTS,
        this.clientDataRequestToFBListener_,
        false,
        this
    );

    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.home.enums.Command.GET_DOCS,
        this.clientDataRequestToFBListener_,
        false,
        this
    );

    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.home.enums.Command.GET_IMAGES,
        this.clientDataRequestToFBListener_,
        false,
        this
    );

    if( !this.isRunning_ ){

        this.startServer( this );
    }

    // goog.Timer.callOnce( function( ){
    //
    //     this.clientDataRequestToFBListener_( );
    // }, 1000, this );
};


/**
 * Get data from fb handler.
 * @param  e
 * @private
 */
zz.home.services.FBServerApi.prototype.clientDataRequestToFBListener_ = function( e ){

    var dataset = new zz.net.models.MessageDataset( null, e.messageData );
    var datarow = dataset.firstDatarow( );

    var fbApiDataset = new zz.home.models.FBServerApi( );
    var fbApiDatarow = fbApiDataset.createLast( [ datarow.data ] );
    var request;

    switch( datarow.command ){

        case zz.home.enums.Command.GET_POSTS:

            request = zz.home.enums.Const.POSTS_REQUEST;

            break;

        case zz.home.enums.Command.GET_DOCS:

            request = zz.home.enums.Const.DOCS_REQUEST;

            break;
            
        case zz.home.enums.Command.GET_IMAGES:

            request = zz.home.enums.Const.IMAGES_REQUEST;

            break;
    }

    var requestOptions = {

        protocol: 'https:',
        host: 'graph.facebook.com',
        path: '/v2.8/'
        + zz.home.enums.Const.FB_ID
        + request
        + 'access_token='
        + zz.home.enums.Const.ACCESS_TOKEN,
        method: 'GET'
    };

    var arrData = [ ];
    
    try{

        this.sendDataRequestToFB__( requestOptions,
            
                    arrData,
                    fbApiDatarow.content,
                    fbApiDataset,
                    e );

    }catch( e ){

        console.log( e );
    }
};

/**
 * Send request data to FB.
 * @param {Object} requestOptions
 * @param {Array} arrData
 * @param {zz.home.models.Tutorial} model
 * @param {zz.home.models.FBServerApi} apiModel
 * @param wsEvent
 * @private
 */
zz.home.services.FBServerApi.prototype.sendDataRequestToFB__ = function( requestOptions,
                                                                         arrData,
                                                                         model,
                                                                         apiModel,
                                                                         wsEvent ){
    
    var self = this;
    var postReq;
    
    if( requestOptions.path.indexOf( zz.home.enums.Const.DOCS_REQUEST ) >=0 
        || requestOptions.path.indexOf( zz.home.enums.Const.POSTS_REQUEST ) >=0 ){

        postReq = https.request( requestOptions, function( res ){

            self.fbDataResponseListener_( res, arrData, model, apiModel, wsEvent );
        } );
        
    }else if( requestOptions.path.indexOf( zz.home.enums.Const.IMAGES_REQUEST ) >=0 ){

        postReq = https.request( requestOptions, function( res ){

            self.fbImagesResponseListener_( res, arrData, model, apiModel, wsEvent );
        } );
    }

    postReq.on( 'error', function( e ){

        console.log( 'problem with request: ' + e.message );
    });

    postReq.end( );
};

/**
 * FB data (docs and feed) response listener.
 * @param res
 * @param {Array} arrData
 * @param {zz.home.models.Tutorial} model
 * @param {zz.home.models.FBServerApi} apiModel
 * @param wsEvent
 * @private
 */
zz.home.services.FBServerApi.prototype.fbDataResponseListener_ = function( res, arrData, model, apiModel, wsEvent ){

    var dataset, datarow;
    if( wsEvent ){

        dataset = new zz.net.models.MessageDataset( null, wsEvent.messageData );
        datarow = dataset.firstDatarow( );
    }else{

        dataset = new zz.net.models.MessageDataset( );
        datarow = dataset.createLast( );
        datarow.command = zz.home.enums.Command.GET_DOCS;
    }
    var request;

    switch( datarow.command ){

        case zz.home.enums.Command.GET_POSTS:

            request = zz.home.enums.Const.POSTS_REQUEST;

            break;

        case zz.home.enums.Command.GET_DOCS:

            request = zz.home.enums.Const.DOCS_REQUEST;

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

        var nextPage = feed.paging.next;

        //console.log( 'FEED !!!!!!!!@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', feed.data.length, nextPage );

        arrData = arrData.concat( feed.data );
        if( feed.data.length && nextPage ){

            //console.log( 'concat!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1', arrData.length, arrData );

            var nextData = nextPage.slice(

                nextPage.indexOf( 'limit=' ) - 1,
                nextPage.length
            );

            var nextOptions = {

                protocol: 'https:',
                host: 'graph.facebook.com',
                path: '/v2.8/'
                + zz.home.enums.Const.FB_ID
                + request
                + 'access_token='
                + zz.home.enums.Const.ACCESS_TOKEN
                + nextData,
                method: 'GET'
            };

           self.sendDataRequestToFB__( nextOptions, arrData, model, apiModel, wsEvent );

        }else{


            //console.log( "array!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", arrData.length, arrData );
            goog.array.forEach( arrData, function( item ){

                if( item.id.indexOf( '_' ) >= 0 ){

                    item.id = item.id.slice( item.id.indexOf( '_' ) + 1, item.id.length );
                }
            });

            zz.home.services.DataConverter.getInstance( ).FBDataToModel( arrData, model );

            var dataset = new zz.net.models.MessageDataset( null, wsEvent.messageData );
            var datarow = dataset.firstDatarow( );

            self.wsc_.sendMessage(

                zz.net.enums.MessageType.COMMAND,
                datarow.command,
                wsEvent.messageSource,
                apiModel
            );
        }
    } );
};


/**
 * FB album images response listener.
 * @param res
 * @param {Array} arrData
 * @param {zz.home.models.Tutorial} model
 * @param {zz.home.models.FBServerApi} apiModel
 * @param wsEvent
 * @private
 */
zz.home.services.FBServerApi.prototype.fbImagesResponseListener_ = function( res, arrData, model, apiModel, wsEvent ){

    // console.log( 'statusCode:', res.statusCode );
    //console.log( 'headers:', res.headers );
    var dataset, datarow;
    if( wsEvent ){

        dataset = new zz.net.models.MessageDataset( null, wsEvent.messageData );
        datarow = dataset.firstDatarow( );
    }else{

        dataset = new zz.net.models.MessageDataset( );
        datarow = dataset.createLast( );
        datarow.command = zz.home.enums.Command.GET_IMAGES;
    }
    
    var dataFB = "";
    var self = this;

    res.on( 'data', function( d ){

        process.stdout.write( d );
        dataFB += d;
    });

    res.on( "end", function( ){

        var feed = goog.json.parse( dataFB );

        var nextPage = feed.paging.next;

        arrData = arrData.concat( feed.data );


        if( feed.data.length && nextPage ){

            var nextData = nextPage.slice(

                nextPage.indexOf( 'limit=' ) - 1,
                nextPage.length
            );

            var nextOptions = {

                protocol: 'https:',
                host: 'graph.facebook.com',
                path: '/v2.8/'
                + zz.home.enums.Const.FB_ID
                + zz.home.enums.Const.IMAGES_REQUEST
                + 'access_token='
                + zz.home.enums.Const.ACCESS_TOKEN
                + nextData,
                method: 'GET'
            };

            self.sendDataRequestToFB____( nextOptions, arrData, model, apiModel, wsEvent );

        }else{

            goog.array.forEach( arrData, function( album ){

                goog.array.sort( album.photos.data, function( a, b ){

                    return a.name - b.name;
                } );
            } );
            zz.home.services.DataConverter.getInstance( ).FBImagesToModel( arrData, model );
            var dataset = new zz.net.models.MessageDataset( null, wsEvent.messageData );
            var datarow = dataset.firstDatarow( );

            self.wsc_.sendMessage(

                zz.net.enums.MessageType.COMMAND,
                datarow.command,
                wsEvent.messageSource,
                apiModel
            );
        }
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
zz.home.services.FBServerApi.prototype.openListener_ = function( ){ };

/**
 * Service ready event handler.
 * @private
 */
zz.home.services.FBServerApi.prototype.readyListener_ = function( ){

    console.log( 'Service is ready as ' + this.wsc_.path_ );
};

/**********************************************************************************************************************
 * Exports                                                                                                            *
 **********************************************************************************************************************/

goog.exportSymbol( 'zz.home.services.FBServerApi', zz.home.services.FBServerApi );
var fb = new zz.home.services.FBServerApi( 'ws://localhost:7777' );