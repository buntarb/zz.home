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
goog.require( 'goog.Timer' );

goog.require( 'zz.net.WebSocketClient' );
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
        this.sendRequestToFB_,
        false,
        this
    );
    if( !this.isRunning_ ){

        this.startServer( this );
    }
};

/**
 * Get posts handler.
 * @param  e
 * @private
 */
zz.home.services.FBServerApi.prototype.sendRequestToFB_ = function( e ){

    var dataset = new zz.net.models.MessageDataset( null, e.messageData );
    var datarow = dataset.firstDatarow( );
    var fbApiDataset = new zz.home.models.FBServerApi( );
    var fbApiDatarow = fbApiDataset.createLast( [ datarow.data ] );

    var accessToken = 'EAACEdEose0cBAPrmtDzYhPgxn9FvzEy3RirRkXyrtL1smCE48unVc1cEP5tPT2ixNPCfxcMY8Fe3ShgzBp4247cthYv1g1IH6KLab9DiH73vBZCZAjWwFFz0RkuvjIfUgMzGjvMnrhJ5gO1m7eHZCVvrCO8F46VC0gdNyRo88fiIotjAwUqaQj7AQG06nUZD';
    var method = 'GET';

    var postOptions = {

        protocol: 'https:',
        host: 'graph.facebook.com',
        path: '/v2.8/' + zz.home.enums.Const.FB_ID + '?access_token=' + accessToken +  '&fields=feed',
        method: method
    };

    try{

        var self = this;
        var postReq = https.request( postOptions, function( res ){

            // console.log( 'statusCode:', res.statusCode );
            //console.log( 'headers:', res.headers );

            var dataFB = "";
            res.on( 'data', function( d ){

                process.stdout.write( d );
                dataFB += d;
            });

            res.on( "end", function( ){

                var arrData = goog.json.parse( dataFB ).feed.data;
                zz.home.services.DataToModel.getInstance( ).FBDataToModel( arrData, fbApiDatarow.content );

                console.log( '2!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!2',  fbApiDatarow );

                self.wsc_.sendMessage(

                    zz.net.enums.MessageType.COMMAND,
                    datarow.command,
                    e.messageSource,
                    fbApiDataset
                );

            } );
        } );

        postReq.on( 'error', function( e ){

            console.log( 'problem with request: ' + e.message );
        });

        postReq.end( );

    }catch( e ){

        console.log( e );
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