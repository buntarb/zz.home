goog.provide( 'controllers.tmp' );
goog.require( 'models.tmp' );
goog.require( 'views.tmp' );
goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * Controller.
 * @extends {zz.controllers.FEBase}
 */
controllers.tmp = class extends zz.controllers.FEBase{

	constructor( ){
		super(
			new models.tmp( ),
			views.tmp.getInstance( )
		)
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
	bootstrap( ){ }
};
zz.environment.services.MVCRegistry

	.setController( 'controllerstmp' , controllers.tmp );
