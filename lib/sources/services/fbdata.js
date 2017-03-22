/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */


/**********************************************************************************************************************
 * Globals                                                                                                            *
 **********************************************************************************************************************/

var https = require('https');
var idk = require( 'imazzine-developer-kit' );

goog.provide( 'zz.home.services.FBData' );

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
goog.require( 'zz.home.models.FBData' );


/**********************************************************************************************************************
 * Constructor                                                                                                        *
 **********************************************************************************************************************/

/**
 * Server service for work with facebook.
 * @param {string} url Server url for websocket connection.
 * @param {string} opt_protocol
 * @constructor
 */
zz.home.services.FBData = function( url, opt_protocol ){

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
        this.clientRequestListener_,
        false,
        this
    );

    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.home.enums.Command.REQUEST_DOCS,
        this.clientRequestListener_,
        false,
        this
    );

    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.home.enums.Command.REQUEST_IMAGES,
        this.clientRequestListener_,
        false,
        this
    );
};

/**
 * Listener for client's request for data from facebook.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.home.services.FBData.prototype.clientRequestListener_ = function( e ){

    var dataset = new zz.net.models.MessageDataset( null, e.messageData );
    var datarow = dataset.firstDatarow( );
    var fbDataset = new zz.home.models.FBData( );
    var fbDatarow = fbDataset.createLast( [ datarow.data ] );
    var arrData = [ ];
    var requestOptions = this.getRequestOptions_( datarow.command );
    
    try{

        this.sendRequestToFB_( requestOptions, arrData, fbDatarow.content, fbDataset, e );

    }catch( e ){

        console.log( e );
    }
};

/**
 * Send request for data to facebook.
 * @param {Object} requestOptions Options for request to facebook.
 * @param {Array} arrData Array for storing data from facebook.
 * @param {zz.home.models.Tutorial} model Submodel with facebook data for websocket message.
 * @param {zz.home.models.FBData} fbDataModel Model for websocket message.
 * @param {zz.net.events.WebSocketClientMessage} wsEvent Websocket message event.
 * @private
 */
zz.home.services.FBData.prototype.sendRequestToFB_ =
    function( requestOptions, arrData, model, fbDataModel, wsEvent ){
    
    var self = this;
    var postReq = https.request( requestOptions, function( res ){

        self.fbResponseListener_( res, arrData, model, fbDataModel, wsEvent );
    } );

    postReq.on( 'error', function( e ){

        console.log( 'problem with request: ' + e.message );
    });

    postReq.end( );
};

/**
 * Facebook data response listener.
 * @param res Response from facebook.
 * @param {Array} arrData Array for storing data from facebook.
 * @param {zz.home.models.Tutorial} model Subomodel with facebook data for websocket message.
 * @param {zz.home.models.FBData} fbDataModel Model for websocket message.
 * @param {zz.net.events.WebSocketClientMessage} wsEvent Websocket message event.
 * @private
 */
zz.home.services.FBData.prototype.fbResponseListener_ =
    function( res, arrData, model, fbDataModel, wsEvent ){

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

            self.sendRequestToFB_( requestOptions, arrData, model, fbDataModel, wsEvent );

        }else{

            self.sendDataToClient_( datarow.command, arrData, model, fbDataModel, wsEvent.messageSource );
        }
    } );
};

/**
 * Send data to client.
 * @param {string} command Websocket command.
 * @param {Array} arrData Array for storing data from facebook.
 * @param {zz.home.models.Tutorial} model Subomodel with facebook data for websocket message.
 * @param {zz.home.models.FBData} fbDataModel Model for websocket message.
 * @param {string} clientSource Source of client.
 * @private
 */
zz.home.services.FBData.prototype.sendDataToClient_ =
    function( command, arrData, model, fbDataModel, clientSource ){

    switch( command ){

        case zz.home.enums.Command.REQUEST_DOCS:

            zz.home.services.DataConverter.getInstance( ).fixId( arrData );
            zz.home.services.DataConverter.getInstance( ).fbDataToModel( arrData, model );

            break;

        case zz.home.enums.Command.REQUEST_POSTS:

            zz.home.services.DataConverter.getInstance( ).fixId( arrData );
            zz.home.services.DataConverter.getInstance( ).fbDataToModel( arrData, model );

            break;

        case zz.home.enums.Command.REQUEST_IMAGES:

            zz.home.services.DataConverter.getInstance( ).sortImagesByName( arrData );
            zz.home.services.DataConverter.getInstance( ).fbImagesToModel( arrData, model );

            break;
    }

    this.wsc_.sendMessage( zz.net.enums.MessageType.COMMAND, command, clientSource, fbDataModel );
};

/**
 * Get request options.
 * @param {string} command Websocket command.
 * @param {string=} opt_pagination Optional parameter with link for pagination of facebook data.
 * @private
 */
zz.home.services.FBData.prototype.getRequestOptions_ = function( command, opt_pagination ){

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

    if( opt_pagination ){

        var nextPage = opt_pagination.slice(

            opt_pagination.indexOf( 'limit=' ) - 1,
            opt_pagination.length
        );

        requestOptions.path = requestOptions.path + nextPage;
    }
    
    return requestOptions;
};

/**
 * Service open event handler.
 * @private
 */
zz.home.services.FBData.prototype.openListener_ = function( ){ };

/**
 * Service ready event handler.
 * @private
 */
zz.home.services.FBData.prototype.readyListener_ = function( ){

    console.log( 'Service is ready as ' + this.wsc_.path_ );
};

/**********************************************************************************************************************
 * Exports                                                                                                            *
 **********************************************************************************************************************/

goog.exportSymbol( 'zz.home.services.FBData', zz.home.services.FBData );
var fb = new zz.home.services.FBData( 'ws://localhost:7777' );