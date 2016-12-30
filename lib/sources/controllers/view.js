goog.provide( 'zz.home.controllers.View' );
goog.require( 'zz.home.models.View' );
goog.require( 'zz.home.views.View' );
goog.require( 'zz.app.controllers.FEViewController' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * Controller.
 * @extends {zz.controllers.FEBase}
 */
zz.home.controllers.View =
    class extends zz.app.controllers.FEViewController{

	constructor( ){
		super(
			new zz.home.models.View( ),
			zz.home.views.View.getInstance( ) );
	}

	/**
	 * @override
	 */
	setupListenersInternal( ){ }

	/**
	 * @override
	 */
	setupModelInternal( ){
	    
	    this
	        .getModel( )
	        .createLast( [ 'View' ] );
	}

	/**
	 * @override
	 */
	bootstrap( ){ }
};
