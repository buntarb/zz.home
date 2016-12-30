goog.provide( 'zz.home.views.View' );
goog.require( 'zz.home.templates.view' );
goog.require( 'zz.views.FEBase' );

/**
 * View (root controller) view.
 * @extends {zz.views.FEBase}
 */
zz.home.views.View = class extends zz.views.FEBase{

	constructor( ){
		super(
		    zz.home.templates.view.model,
		    zz.home.templates.view.dataset,
		    zz.home.templates.view.datarow );
	}
};
goog.addSingletonGetter( zz.home.views.View );