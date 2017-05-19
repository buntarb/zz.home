goog.provide( 'zz.home.controllers.Application' );

goog.require( 'zz.home.enums.Languages' );

goog.require( 'zz.home.models.Application' );
goog.require( 'zz.home.factories.Application' );
goog.require( 'zz.home.views.Application' );
goog.require( 'zz.home.controllers.Layout' );

goog.require( 'zz.app.controllers.FERootController' );

/**
 * Controller.
 * @extends {zz.app.controllers.FERootController}
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
	setupListenersInternal( ){}

	/**
	 * @override
	 */
	setupModelInternal( ){ }

	/**
	 * @override
	 */
	bootstrap( ){}

	/**
	 * Get layout controller.
	 * @return {zz.home.controllers.Layout}
	 */
	getLayoutController( ){

		return this.getChildAt( 0 );
	}
};
