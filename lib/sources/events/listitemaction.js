goog.provide( 'zz.ui.events.ListItemAction' );
goog.require( 'zz.ui.enums.EventType' );
goog.require( 'zz.events.BaseEvent' );

/**
 * List item action event.
 * @extends {zz.events.BaseEvent}
 */
zz.ui.events.ListItemAction = class extends zz.events.BaseEvent{

    /**
     * @param {zz.ui.controllers.List} controller
     * @param {zz.ui.models.ListDatarow} model
     * @param {Array<Element>} elements
     */
	constructor( controller, model, elements ){
	    
		super( zz.ui.enums.EventType.LIST_ITEM_ACTION );
	    
	    /**
    	 * Controller, related with current event.
    	 * @type {zz.controllers.FEBase}
    	 */
	    this.controller = controller;
	    
	    /**
    	 * Datarow, related with current event.
    	 * @type {zz.ui.models.ListDatarow}
    	 */
	    this.model = model;
	    
	    /**
    	 * Elements, related with current event.
    	 * @type {Array<Element>}
    	 */
	    this.elements = elements;
	}
};
