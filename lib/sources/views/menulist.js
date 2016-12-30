goog.provide( 'zz.home.views.MenuList' );
goog.require( 'zz.ui.views.List' );
goog.require( 'zz.ui.templates.menuList' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * View.
 * @extends {zz.views.FEBase}
 */
zz.home.views.MenuList = class extends zz.ui.views.List{

	constructor( ){
		super(
		    zz.ui.templates.menuList.model,
		    zz.ui.templates.menuList.dataset,
		    zz.ui.templates.menuList.datarow );
	}

};
goog.addSingletonGetter( zz.home.views.MenuList );
zz.environment.services.MVCRegistry
	.setView(
	    'zz-home-menu-list',
	    zz.home.views.MenuList );