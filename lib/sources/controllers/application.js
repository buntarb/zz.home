goog.provide( 'zz.home.controllers.Application' );

goog.require( 'zz.home.enums.Languages' );

goog.require( 'zz.home.services.Settings' );
goog.require( 'zz.home.services.Router' );
goog.require( 'zz.home.services.FBDataClient' );
goog.require( 'zz.home.models.Application' );
goog.require( 'zz.home.factories.Application' );
goog.require( 'zz.home.views.Application' );
goog.require( 'zz.home.controllers.Layout' );
goog.require( 'zz.home.controllers.View' );
goog.require( 'zz.home.controllers.Tutorial' );

goog.require( 'zz.app.services.FESimpleRouter' );
goog.require( 'zz.app.controllers.FERootController' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'zz.home.services.SocketClient' );

/**
 * Controller.
 * @extends {zz.controllers.FEBase}
 */
zz.home.controllers.Application =
    class extends zz.app.controllers.FERootController{

	constructor( ){
		super(
			new zz.home.models.Application(
			    undefined,
			    zz.home.factories.Application
			        .getInstance( )
			        .getApplicationDataset( ) ),
			zz.home.views.Application
			    .getInstance( ) );
	}

	/**
	 * @override
	 */
	setupListenersInternal( ){

        // websocket listener.
        if( !this.getWSClient( ).isReady( ) ){

            this
                .getHandler( ).listenWithScope(

                this.getWSClient( ),
                zz.net.enums.EventType.WEB_SOCKET_READY,
                this.webSocketReadyListener_,
                false,
                this
            );
        }
	}

	/**
	 * @override
	 */
	setupModelInternal( ){ }

	/**
	 * @override
	 */
	bootstrap( ){
	    
	    this
	        .getRouter( )
	        .setRootController( this )
	        .when( '/home', zz.home.controllers.Layout, zz.home.controllers.View )
	        .when( '/tutorial', zz.home.controllers.Layout, zz.home.controllers.Tutorial )
	        .when( '/guide', zz.home.controllers.Layout, zz.home.controllers.View )
	        .when( '/reference', zz.home.controllers.Layout, zz.home.controllers.View )
            .when( '/tutorial?step=:step', zz.home.controllers.Layout, zz.home.controllers.Tutorial )
	        .otherwise( '/home' )
	        .bootstrap( );

        if( this.getWSClient( ).isReady( ) ){

            this.webSocketReadyListener_( );
        }

        this.getSettings( )

			.setUserLanguage( zz.home.enums.Languages.RU );
	}

	/**
	 * Websocket ready event handler.
	 * @param {zz.net.events.WebSocketClientReady=} opt_e
	 * @private
	 */
	webSocketReadyListener_( opt_e ){

        zz.home.services.FBDataClient.getInstance( ).requestTutorial( );
	}

	/**
	 * @returns {zz.home.services.Router}
	 */
	getRouter( ){
	    
	    return zz.home.services.Router
	        .getInstance( );
	}

    /**
    * Get web socket client.
    * @return {zz.net.WebSocketClient}
    * @deprecated
    */
    getWSClient( ){

        return zz.home.services.SocketClient
            .getInstance( )
            .getClient( );
    }

	/**
	 * Get layout controller.
	 * @return {zz.home.controllers.Layout}
	 */
	getLayoutController( ){

		return this.getChildAt( 0 );
	}

	/**
	 * Get settings service.
	 * @return {zz.home.services.Settings}
	 */
	getSettings( ){

		return zz.home.services.Settings.getInstance( );
	}
};
