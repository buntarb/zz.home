goog.provide( 'zz.home.controllers.Application' );
goog.require( 'zz.home.models.Application' );
goog.require( 'zz.home.factories.Application' );
goog.require( 'zz.home.views.Application' );
goog.require( 'zz.home.controllers.Layout' );
goog.require( 'zz.home.controllers.View' );
goog.require( 'zz.home.controllers.Tutorial' );

goog.require( 'zz.app.services.FERouter' );
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
			    
		zz.home.services.SocketClient.getInstance( );
	}

	/**
	 * @override
	 */
	setupListenersInternal( ){ }

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
	        .otherwise( '/home' )
	        .bootstrap( );
	}
	
	/**
	 * @returns {zz.app.services.FERouter}
	 */
	getRouter( ){
	    
	    return zz.app.services.FERouter
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
};
