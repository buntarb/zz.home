goog.provide( 'zz.home.views.NavigationList' );
goog.require( 'zz.ui.views.List' );
goog.require( 'zz.ui.templates.navigationList' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * View.
 * @extends {zz.views.FEBase}
 */
zz.home.views.NavigationList = class extends zz.ui.views.List{

	constructor( ){
		super(
		    zz.ui.templates.navigationList.model,
		    zz.ui.templates.navigationList.dataset,
		    zz.ui.templates.navigationList.datarow );
	}

};
goog.addSingletonGetter( zz.home.views.NavigationList );
zz.environment.services.MVCRegistry
	.setView(
	    'zz-home-navigation-list',
	    zz.home.views.NavigationList );