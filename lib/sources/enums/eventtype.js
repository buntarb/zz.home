goog.provide( 'zz.home.enums.EventType' );
goog.require( 'goog.events' );

/**
 * Description.
 * @type {string}
 */
zz.home.enums.EventType = {

    DATA_IS_CONVERTED: goog.events.getUniqueId( 'data-is-converted' ),
    DATA_IS_READY: goog.events.getUniqueId( 'data-is-ready' )
};