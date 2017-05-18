goog.provide( 'zz.home.views.Application' );

goog.require( 'zz.home.templates.application' );
goog.require( 'zz.views.FEBase' );

/**
 * Application (root controller) view.
 * @extends {zz.views.FEBase}
 */
zz.home.views.Application = class extends zz.views.FEBase{

	constructor( ){
		super(
		    zz.home.templates.application.model,
		    zz.home.templates.application.dataset,
		    zz.home.templates.application.datarow );
	}
};
goog.addSingletonGetter( zz.home.views.Application );