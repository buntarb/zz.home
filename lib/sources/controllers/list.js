goog.provide( 'zz.ui.controllers.List' );
goog.require( 'zz.ui.events.ListItemAction' );

goog.require( 'zz.models.enums.EventType' );
goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.controllers.enums.EventType' );
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
	    this
	        .getHandler( )
	        .listenWithScope(

                this.getModel( ),
                zz.models.enums.EventType.DATAROW_UPDATE,
                this.datarowUpdateHandler,
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
	
	/**
	 * @param {zz.models.events.DatarowUpdate} e
	 */
	datarowUpdateHandler( e ){
	    
	    if( e.message.dataset.getUid( ) ===
	        this.getModel( ).getUid( ) ){
            
            switch( e.message.datafield ){
                
                case this.getModel( ).datafield.icon:
                    
                    this
                        .getView( )
                        .setIconClass(
                            e.message.datarow.getUid( ),
                            e.message.new_value );
                    break;
                
                default:
                    break;
            }
        }
	}
	
	/**
	 * @param {string} className
	 */
	addSelector( className ){
	    
	    this
	    .getView( )
	    .addSelector( this, className );
	}
	
	/**
	 * @param {string} className
	 */
	removeSelector( className ){
	    
	    this
	    .getView( )
	    .removeSelector( this, className );
	}
};
zz.environment.services.MVCRegistry
	.setController(
	    'zz-ui-list' ,
	    zz.ui.controllers.List );