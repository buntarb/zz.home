goog.provide( 'views.tmp' );
goog.require( 'zz.views.FEBase' );
goog.require( 'templates' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * View.
 * @extends {zz.views.FEBase}
 */
views.tmp = class extends zz.views.FEBase{

	constructor( ){
		super( templates.tmp )
	}

};
goog.addSingletonGetter( views.tmp );
zz.environment.services.MVCRegistry

	.setView( 'viewstmp' , views.tmp );
