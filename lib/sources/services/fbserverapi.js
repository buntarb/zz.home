/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */


/**********************************************************************************************************************
 * Globals                                                                                                            *
 **********************************************************************************************************************/

var idk = require( 'imazzine-developer-kit' );
var http = require('https');

goog.provide( 'zz.home.services.FBServerApi' );

goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.net.XhrIo' );
goog.require( 'goog.Timer' );

goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.net.models.MessageDataset' );
goog.require( 'zz.home.models.FBServerApi' );
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

    /**
     * Map commands on their listeners {command: {binder, function}, ...}
     */
    var commandListenerMap = { };

    commandListenerMap[ zz.home.enums.Command.GET_POSTS ] = {
        binder: this.defaultBinder_,
        fun: this.sendRequestToFB_
    };

    /**
     * Registering supported commands,
     * binding commands on their listeners
     */
    this.setUpCommands_( commandListenerMap );

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

    this.startServer( this );
};

/**
 * Get posts handler.
 * @param {?Object|undefined} this_ Context
 * @private
 */
zz.home.services.FBServerApi.prototype.sendRequestToFB_ = function( this_ ){

    this_ = this_? this_: this;

    console.log( '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1');
    var accessToken = 'EAACEdEose0cBAEScUibQI1oVX09pCLPN4DiH9neRlAoqdzDi7ErmWmy6vEeHibxx1WrXDZAUj7ZCfQZBzLq7IQ84cay8aoZCrzLulZA3Sj7ChUd9OqZCC0to6H79n1P94PKZC4bSuCZAZAkhG0iQtRttGprXVpbGLjm4CN9BxbSaUEwbLn5ZCrHdZBvQEYzylJtlE4ZD';
    var url = 'https://graph.facebook.com/' + zz.home.enums.Const.FB_ID + '?access_token=' + accessToken +  '&fields=feed';
    var method = 'GET';
    var content;
    var headers;
    // var sender = new goog.net.XhrIo( );
    // sender.send( url, method, content, headers );
    // console.log( sender );
    //
    // goog.Timer.callOnce( function(){
    //
    //     console.log( sender.getStatus() );
    //     console.log( sender.getStatusText() );
    //
    // }, 1000 );

    var postOptions = {
        protocol: 'https:',
        host: 'graph.facebook.com',
        path: '/v2.8/' + zz.home.enums.Const.FB_ID + '?access_token=' + accessToken +  '&fields=feed',
        method: method
    };

    // Set up the request
    try{
        var postReq = http.request( postOptions, function( res ) {

            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);
            res.on('data', (d) => {
                process.stdout.write(d);
            });
        });
        postReq.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
        postReq.end();
    }catch (e){

        console.log(e);
    }
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
 * Registering supported commands,
 * binding commands on their listeners
 * @param {Object} commandListenerMap
 * @private
 */
zz.home.services.FBServerApi.prototype.setUpCommands_ = function( commandListenerMap ){

    for( var command in commandListenerMap ){

        this.wsc_.addSupportedCommand( command );

        /**
         * Binding commands to handlers.
         */
        this.eventHandler_.listenWithScope(
            this.wsc_,
            command,
            commandListenerMap[command].binder( commandListenerMap[command].fun ),
            false,
            this
        );
    }
};

/**
 * Bind specific service operation to use it as typical event handler
 * @param {Function} fun Service operation
 * @return {Function} Event handler
 * @private
 */
zz.home.services.FBServerApi.prototype.defaultBinder_ = function( fun ){

    /**
     * Service message event handler.
     * @param {zz.net.events.WebSocketClientMessage} input
     */
    var handler = function( input ){

        var fbServerModel = undefined;
        var fbApiDatarow = undefined;
        var data = input;
        var datarow = undefined;

        try{

            var dataset = new zz.net.models.MessageDataset( null, data.messageData );
            datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );


            fbServerModel = new zz.home.models.FBServerApi( null, goog.json.unsafeParse( datarow.data ) );
            fbApiDatarow = /** @type {zz.home.models.FBServerApi} */ ( fbServerModel.firstDatarow( ) );

            fun( this );

        }catch( e ){

            if( !fbApiDatarow ){

                fbServerModel = new zz.home.models.FBServerApi();
                fbApiDatarow = fbServerModel.createLast( [ ] );
            }

            fbApiDatarow.stderr = '' + e;
        }

        try {

            this.wsc_.sendMessage( zz.net.enums.MessageType.COMMAND, datarow.command, data.messageSource, fbServerModel );

        }catch ( e ){

            console.log( 'Error sending message: ' + e );
        }
    };

    return handler;
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

/**
 *
 * @private
 */
zz.home.services.FBServerApi.prototype.responseFromFBHandler_ = function( ){

    //var response = this.getResponseBody( );
   console.log(  '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11answer from fb' );
};

/**********************************************************************************************************************
 * Exports                                                                                                            *
 **********************************************************************************************************************/

goog.exportSymbol( 'zz.home.services.FBServerApi', zz.home.services.FBServerApi );
var fb = new zz.home.services.FBServerApi( 'ws://localhost:7777' );