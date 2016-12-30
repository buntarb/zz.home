/**
* @fileoverview Provide zz.home base object.
* @license Apache-2.0
* @copyright Artem Lytvynov <buntarb@gmail.com>
*/

goog.provide( 'zz.home' );
goog.require( 'goog.dom' );
goog.require( 'goog.events' );
goog.require( 'zz.home.controllers.Application' );

goog.require( 'zz.ui.controllers.List' );
goog.require( 'zz.home.views.NavigationList' );


zz.home = zz.home || {};

/**
 * Bootstrap module method.
 */
zz.home.bootstrap = function( ){

    // var model = new zz.ui.models.List(
    //     undefined,
    //     zz.ui.factories.List
    //         .getInstance( )
    //         .getDummyDataset( ) );
                
    // var controller = new zz.ui.controllers.List(
    //     model,  
    //     zz.ui.views.List
    //         .getInstance( ),
    //     true );
      
    // goog.events.listen(
        
    //     controller,
    //     zz.controllers.enums.EventType.ACTION,
    //     function( e ){ console.log( e ); }
    // );      
    // goog.events.listen(
        
    //     controller,
    //     zz.ui.enums.EventType.LIST_ITEM_ACTION,
    //     function( e ){ console.log( e ); }
    // );
    
    window.controller = new zz.home.controllers.Application( );
};
goog.exportSymbol( 'zz.home.bootstrap', zz.home.bootstrap );