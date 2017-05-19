/**
* @fileoverview Provide zz.home base object.
* @license Apache-2.0
* @copyright Artem Lytvynov <buntarb@gmail.com>
*/

goog.provide( 'zz.home' );

goog.require( 'zz.home.controllers.Application' );

zz.home = zz.home || {};

/**
 * Bootstrap module method.
 */
zz.home.bootstrap = function( ){
    
    window.controller = new zz.home.controllers.Application( );
};
goog.exportSymbol( 'zz.home.bootstrap', zz.home.bootstrap );