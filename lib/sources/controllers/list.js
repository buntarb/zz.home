goog.provide( 'zz.ui.controllers.List' );

goog.require( 'zz.ui.events.ListItemAction' );
goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * Controller.
 * @extends {zz.controllers.FEBase}
 */
zz.ui.controllers.List = class extends zz.controllers.FEBase{

    /**
     * @param {zz.ui.models.List} model
     * @param {zz.ui.views.List} view
     * @param {boolean} opt_suppressAction
     */
	constructor( model, view, opt_suppressAction ){
	    
		super( model, view );
		
		/**
		 * @type {boolean}
		 */
		this.suppressAction_ = opt_suppressAction || false;
	}

	/**
	 * @override
	 */
	setupListenersInternal( ){

        this
            .getHandler( )
            .listenWithScope(

                this,
                zz.controllers.enums.EventType.ACTION,
                this.actionHandler,
                false,
                this
            );
	}

	/**
	 * @override
	 */
	setupModelInternal( ){ }

	/**
	 * @override
	 */
	bootstrap( ){ }

    /**
     * @param {zz.controllers.events.Action} e
     */
    actionHandler( e ){

        if( goog.getUid( e.controller ) ===
            goog.getUid( this ) ){

            if( !e.model.disable ){

                this.dispatchEvent(
                    new zz.ui.events.ListItemAction(
                        e.controller,
                        e.model,
                        e.elements ) );
            }
            if( this.suppressAction_ ){

                e.preventDefault( );
                e.stopPropagation( );
            }
        }
    }
};
zz.environment.services.MVCRegistry
	.setController(
	    'zz-ui-list' ,
	    zz.ui.controllers.List );