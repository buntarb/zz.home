goog.provide( 'zz.home.views.Layout' );
goog.require( 'zz.views.FEBase' );
goog.require( 'zz.home.templates.layout' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'goog.dom.classlist' );

/**
 * View.
 * @extends {zz.views.FEBase}
 */
zz.home.views.Layout = class extends zz.views.FEBase{

	constructor( ){
		super(
		    zz.home.templates.layout.model,
		    zz.home.templates.layout.dataset,
		    zz.home.templates.layout.datarow );
	}
};
goog.addSingletonGetter( zz.home.views.Layout );
zz.environment.services.MVCRegistry
	.setView( 'zz-home-layout' , zz.home.views.Layout );