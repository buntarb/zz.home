goog.provide( 'zz.ui.enums.EventType' );
goog.require( 'goog.events' );

/**
 * Description.
 * @type {string}
 */
zz.ui.enums.EventType = {

    LIST_ITEM_ACTION: goog.events.getUniqueId( 'list-item-action' ),
    DATA_WAS_GOT: goog.events.getUniqueId( 'data-was-got' )
};