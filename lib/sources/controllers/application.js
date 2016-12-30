goog.provide( 'zz.home.controllers.Application' );
goog.require( 'zz.home.models.Application' );
goog.require( 'zz.home.factories.Application' );
goog.require( 'zz.home.views.Application' );
goog.require( 'zz.home.controllers.Layout' );

goog.require( 'zz.app.services.FERouter' );
goog.require( 'zz.app.services.FESimpleRouter' );
goog.require( 'zz.app.controllers.FERootController' );
goog.require( 'zz.environment.services.MVCRegistry' );

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
	setupListenersInternal( ){ }

	/**
	 * @override
	 */
	setupModelInternal( ){ }

	/**
	 * @override
	 */
	bootstrap( ){
	    
	    zz.app.services.FESimpleRouter
	        .getInstance( )
	        .when( '/', zz.home.controllers.Layout )
	        .when( '/tutorial', zz.home.controllers.Layout )
	        .when( '/guide', zz.home.controllers.Layout )
	        .when( '/reference', zz.home.controllers.Layout )
	        .otherwise( '/' )
	        .bootstrap( );
	}
	
	/**
	 * @returns {z.app.services.FESimpleRouter}
	 */
	getRouter( ){
	    
	    return zz.app.services.FESimpleRouter
	        .getInstance( );
	}
};
