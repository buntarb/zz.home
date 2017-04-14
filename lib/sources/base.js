/**
* @fileoverview Provide zz.home base object.
* @license Apache-2.0
* @author buntarb@gmail.com (Lytvynov Artem)
*/

goog.provide( 'zz.home' );

goog.require( 'goog.dom' );

/**
* Base namespace for zz.home module.
* @const
*/
zz.home = zz.home || { };

/**
* Bootstrap module method.
*/
zz.home.bootstrap = function( ){

    goog.dom.getElement( goog.getCssName( 'root' ) ).innerText = 'Hello world';
};
goog.exportSymbol( 'zz.home.bootstrap', zz.home.bootstrap );