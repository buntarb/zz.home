/**
* @fileoverview Provide zz.home base object.
* @license Apache-2.0
* @author buntarb@gmail.com (Lytvynov Artem)
*/

goog.provide( 'zz.home' );

goog.require( 'goog.dom' );

goog.require( 'zz.home.templates.helloworld' );
goog.require( 'zz.home.models.HelloWorld' );
goog.require( 'zz.views.FEBase' );
goog.require( 'zz.app.controllers.FERootController' );

/**
* Base namespace for zz.home module.
* @const
*/
zz.home = zz.home || { };

/**
* Bootstrap module method.
*/
zz.home.bootstrap = function( ){

    var rootElement = goog.dom.getElement( goog.getCssName( 'root' ) );
    var view = new zz.views.FEBase( zz.home.templates.helloworld.model );
    var model = new zz.home.models.HelloWorld( );
    model.createLast( [ 'Hello world' ] );
    var controller = new zz.app.controllers.FERootController( model, view );
};
goog.exportSymbol( 'zz.home.bootstrap', zz.home.bootstrap );