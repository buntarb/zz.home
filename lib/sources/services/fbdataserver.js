/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */


/**********************************************************************************************************************
 * Globals                                                                                                            *
 **********************************************************************************************************************/

var idk = require( 'imazzine-developer-kit' );
var https = require('https');

goog.provide( 'zz.home.services.FBDataServer' );

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
zz.home.services.FBDataServer = function( url, opt_protocol ){

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


    this.wsc_.addSupportedCommand( zz.home.enums.Command.REQUEST_POSTS );
    this.wsc_.addSupportedCommand( zz.home.enums.Command.REQUEST_DOCS );
    this.wsc_.addSupportedCommand( zz.home.enums.Command.REQUEST_IMAGES );

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
        zz.home.enums.Command.REQUEST_POSTS,
        this.clientDataRequestToFBListener_,
        false,
        this
    );

    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.home.enums.Command.REQUEST_DOCS,
        this.clientDataRequestToFBListener_,
        false,
        this
    );

    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.home.enums.Command.REQUEST_IMAGES,
        this.clientDataRequestToFBListener_,
        false,
        this
    );

    if( !this.isRunning_ ){

        this.startServer( this );
    }
};

/**
 * Listener for client's request for data from FB.
 * @param  e
 * @private
 */
zz.home.services.FBDataServer.prototype.clientDataRequestToFBListener_ = function( e ){

    var dataset = new zz.net.models.MessageDataset( null, e.messageData );
    var datarow = dataset.firstDatarow( );
    var fbApiDataset = new zz.home.models.FBServerApi( );
    var fbApiDatarow = fbApiDataset.createLast( [ datarow.data ] );
    var arrData = [ ];
    var requestOptions = this.getRequestOptions_( datarow.command );
    
    try{

        this.sendDataRequestToFB_( requestOptions,
            
                    arrData,
                    fbApiDatarow.content,
                    fbApiDataset,
                    e );

    }catch( e ){

        console.log( e );
    }
};

/**
 * Send request for data to FB.
 * @param {Object} requestOptions
 * @param {Array} arrData
 * @param {zz.home.models.Tutorial} model
 * @param {zz.home.models.FBServerApi} apiModel
 * @param wsEvent
 * @private
 */
zz.home.services.FBDataServer.prototype.sendDataRequestToFB_ = function( requestOptions,
                                                                         arrData,
                                                                         model,
                                                                         apiModel,
                                                                         wsEvent ){
    
    var self = this;
    var postReq = https.request( requestOptions, function( res ){

        self.fbDataResponseListener_( res, arrData, model, apiModel, wsEvent );
    } );

    postReq.on( 'error', function( e ){

        console.log( 'problem with request: ' + e.message );
    });

    postReq.end( );
};

/**
 * FB data response listener.
 * @param res
 * @param {Array} arrData
 * @param {zz.home.models.Tutorial} model
 * @param {zz.home.models.FBServerApi} apiModel
 * @param wsEvent
 * @private
 */
zz.home.services.FBDataServer.prototype.fbDataResponseListener_ = function( res,
                                                                           arrData,
                                                                           model,
                                                                           apiModel,
                                                                           wsEvent ){

    var dataset = new zz.net.models.MessageDataset( null, wsEvent.messageData );
    var datarow = dataset.firstDatarow( );
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

            var requestOptions = self.getRequestOptions_( datarow.command, nextPage );

            self.sendDataRequestToFB_( requestOptions,

                arrData,
                model,
                apiModel,
                wsEvent
            );

        }else{

            self.sendDataToClient_( datarow.command,

                arrData,
                model,
                apiModel,
                wsEvent.messageSource
            );
        }
    } );
};

/**
 * Send data to client.
 * @param {string} command
 * @param {Array} arrData
 * @param {zz.home.models.Tutorial} model
 * @param {zz.home.models.FBServerApi} apiModel
 * @param {string} clientSource
 * @private
 */
zz.home.services.FBDataServer.prototype.sendDataToClient_ = function( command,
                                                                     arrData,
                                                                     model,
                                                                     apiModel,
                                                                     clientSource ){

    switch( command ){

        case zz.home.enums.Command.REQUEST_DOCS:

            zz.home.services.DataConverter.getInstance( ).fixId( arrData );
            zz.home.services.DataConverter.getInstance( ).FBDataToModel( arrData, model );

            break;

        case zz.home.enums.Command.REQUEST_POSTS:

            zz.home.services.DataConverter.getInstance( ).fixId( arrData );
            zz.home.services.DataConverter.getInstance( ).FBDataToModel( arrData, model );

            break;

        case zz.home.enums.Command.REQUEST_IMAGES:

            zz.home.services.DataConverter.getInstance( ).sortImagesByName( arrData );
            zz.home.services.DataConverter.getInstance( ).FBImagesToModel( arrData, model );

            break;
    }

    this.wsc_.sendMessage(

        zz.net.enums.MessageType.COMMAND,
        command,
        clientSource,
        apiModel
    );
};

/**
 * Get request options.
 * @param {string} command
 * @param {string=} opt_paging
 * @private
 */
zz.home.services.FBDataServer.prototype.getRequestOptions_ = function( command, opt_paging ){

    var requestType;

    switch( command ){

        case zz.home.enums.Command.REQUEST_POSTS:

            requestType = zz.home.enums.Const.REQUEST_POSTS;

            break;

        case zz.home.enums.Command.REQUEST_DOCS:

            requestType = zz.home.enums.Const.REQUEST_DOCS;

            break;

        case zz.home.enums.Command.REQUEST_IMAGES:

            requestType = zz.home.enums.Const.REQUEST_IMAGES;

            break;
    }

    var requestOptions  = {

        protocol: zz.home.enums.Const.FB_API_PROTOCOL,
        host: zz.home.enums.Const.FB_API_HOST,
        path: zz.home.enums.Const.FB_API_VERSION
        + zz.home.enums.Const.FB_ID
        + requestType
        + zz.home.enums.Const.ACCESS_TOKEN,
        method: zz.home.enums.Const.FB_API_METHOD
    };

    if( opt_paging ){

        var nextPage = opt_paging.slice(

            opt_paging.indexOf( 'limit=' ) - 1,
            opt_paging.length
        );

        requestOptions.path = requestOptions.path + nextPage;
    }
    
    return requestOptions;
};


/**
 * Start web server handler.
 * @param {?Object|undefined} this_ Context
 * @private
 */
zz.home.services.FBDataServer.prototype.startServer = function( this_ ){

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
zz.home.services.FBDataServer.prototype.openListener_ = function( ){ };

/**
 * Service ready event handler.
 * @private
 */
zz.home.services.FBDataServer.prototype.readyListener_ = function( ){

    console.log( 'Service is ready as ' + this.wsc_.path_ );
};

/**********************************************************************************************************************
 * Exports                                                                                                            *
 **********************************************************************************************************************/

goog.exportSymbol( 'zz.home.services.FBDataServer', zz.home.services.FBDataServer );
var fb = new zz.home.services.FBDataServer( 'ws://localhost:7777' );