goog.provide( 'zz.home.views.Posts' );
goog.require( 'zz.home.templates.posts' );
goog.require( 'zz.views.FEBase' );

/**
 * Posts view.
 * @extends {zz.views.FEBase}
 */
zz.home.views.Posts = class extends zz.views.FEBase{

	constructor( ){
		super(
		    zz.home.templates.posts.model );
	}
};
goog.addSingletonGetter( zz.home.views.Posts );