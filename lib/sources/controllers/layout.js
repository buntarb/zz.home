goog.provide( 'zz.home.controllers.Layout' );
goog.require( 'zz.home.models.Layout' );
goog.require( 'zz.home.factories.Layout' );
goog.require( 'zz.home.views.Layout' );

goog.require( 'zz.ui.enums.EventType' );

goog.require( 'zz.app.controllers.FELayoutController' );
goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.services.MVCRegistry' );

goog.require( 'goog.Timer' );

/**
 * Controller.
 * @extends {zz.app.controllers.FEViewController}
 */
zz.home.controllers.Layout =
    class extends zz.app.controllers.FELayoutController{

	constructor( ){
		super(
			new zz.home.models.Layout(
			    undefined,
			    zz.home.factories.Layout
			        .getInstance( )
			        .getLayoutDataset( ) ),
			zz.home.views.Layout
			    .getInstance( ) );
	}
	
    /**
     * Add view controller.
     * @param {Function} viewCtrl
     * @protected
     * @override
     */
    fadeoutViewInternal( ){
    
        //
    }

    /**
     * Add view controller.
     * @param {Function} ViewCtrl
     * @protected
     * @override
     */
    setViewInternal( ViewCtrl ){
    
        this.viewCtrl_ = new ViewCtrl( );
        this.addChild( this.viewCtrl_, false );
        this.viewCtrl_.render( this.getViewWrapper( ) );
    }

    /**
     * Remove view controller.
     * @protected
     * @override
     */
    removeViewInternal( ){
    
        if( this.viewCtrl_ ){
    
            this.viewCtrl_.dispose( );
        }
    }

    /**
     * Set view controller.
     * @param {Function} constructorFn
     */
    setViewController( constructorFn ){
        
        this
            .getView( )
            .fadeoutView( this );
        
        goog.Timer.callOnce(
            
            function( ){
                
                
                this.removeViewInternal( );
                this.setViewInternal( constructorFn );
                this
                    .getView( )
                    .fadeinView( this );
            }, 
            200,
            this );
    }

	/**
	 * @override
	 */
	setupListenersInternal( ){
	    
	    // Router listener.
	    this
	        .getHandler( )
	        .listenWithScope(
	            
	            this
	                .getEnvironment( )
	                .getRootController( )
	                .getRouter( ),
                zz.environment.enums.EventType.ROUTED,
                this.bootstrap,
                false,
                this
	        );
	    
	    // Action listener (main button, etc.).
	    this
	        .getHandler( )
	        .listenWithScope(
	        
	            this,
	            zz.controllers.enums.EventType.ACTION,
	            this.actionListener_,
	            false,
	            this );
        
        // Navigation list listener.
        this
            .getHandler( )
            .listenWithScope(
                
                this.getNavigationController( ),
                zz.ui.enums.EventType.LIST_ITEM_ACTION,
                this.navigationListItemActionListener_,
                false,
                this
            );
        
        // Menu list listener.
        this
            .getHandler( )
            .listenWithScope(
                
                this.getMenuController( ),
                zz.ui.enums.EventType.LIST_ITEM_ACTION,
                this.navigationListItemActionListener_,
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
	bootstrap( ){
	    
	    this.updateTitle( );
	    this.updateActiveLink( );
	}
	
	/**
	 * @param {zz.controllers.events.Action} e
	 * @private
	 */
	actionListener_( e ){
	    
	    if( e.controller.getModel().getUid( ) ===
	        this.getModel( ).getUid( ) ){
	            
            if( this.getView( ).isLogo( e.elements[ 0 ] ) ){
                
                this.openMenu( );
                
            }else if( this.getView( ).isObfuscator( e.elements[ 0 ] ) ){
                
                this.closeMenu( );
            }
        }
	}
	
	/**
	 * @param {zz.ui.events.ListItemAction} e
	 * @private
	 */
	navigationListItemActionListener_( e ){
	    
	    this.closeMenu( );
	    this
            .getEnvironment( )
            .getRootController( )
            .getRouter( )
            .setFragment( e.model.id );
	}
	
	/**
	 * @returns {zz.ui.controllers.List}
	 */
	getNavigationController( ){
	    
	    return this
	        .getMVCRegistry( )
	        .get( this
    	        .getModel( )
    	        .firstDatarow( )
    	        .navigation.getUid( ) )
    	    .controller;
	}
	
	/**
	 * @returns {zz.ui.controllers.List}
	 */
	getMenuController( ){
	    
	    return this
	        .getMVCRegistry( )
	        .get( this
    	        .getModel( )
    	        .firstDatarow( )
    	        .menu.getUid( ) )
    	    .controller;
	}
	
	/**
	 * Update header title.
	 */
	updateTitle( ){
	    
	    var navigation = this
	        .getModel( )
	        .firstDatarow( )
	        .navigation;
	    
	    var link = navigation.firstDatarow( );
	    do{
	        
	        if( link.id ===
	            this
	                .getEnvironment( )
	                .getRootController( )
	                .getRouter( )
	                .getFragment( ) ){
                
                this
                    .getModel( )
                    .firstDatarow( )
                    .title =
                        'imazzine.' +
                        link.id.split( '/' )[ 1 ];
                
                this
                    .getModel( )
                    .firstDatarow( )
                    .menuTitle =
                        'zz.' +
                        link.id.split( '/' )[ 1 ];
            }
	    }while( link = navigation.nextDatarow( ) );
	}
	
	/**
	 * Update navigation model according current route.
	 */
	updateActiveLink( ){
	    
	    var navigation = this
	        .getModel( )
	        .firstDatarow( )
	        .navigation;
	    
	    var link = navigation.firstDatarow( );
	    do{
	        
	        link.active = link.id ===
	            this
	                .getEnvironment( )
	                .getRootController( )
	                .getRouter( )
	                .getFragment( );
	        
	    }while( link = navigation.nextDatarow( ) );
	    this.updateMenuActiveLink( );
	}
	
	/**
	 * Update menu model according current route.
	 */
	updateMenuActiveLink( ){
	    
	    var menu = this
	        .getModel( )
	        .firstDatarow( )
	        .menu;
	    
	    var link = menu.firstDatarow( );
	    do{
	        
	        link.active = link.id ===
	            this
	                .getEnvironment( )
	                .getRootController( )
	                .getRouter( )
	                .getFragment( );
	        
	    }while( link = menu.nextDatarow( ) );
	}
	
	/**
	 * Open navigation menu.
	 */
	openMenu( ){
	    
	    this
	        .getModel( )
	        .firstDatarow( )
	        .menuOpened = true;
	}
	
	/**
	 * Close navigation menu.
	 */
	closeMenu( ){
	    
	    this
	        .getModel( )
	        .firstDatarow( )
	        .menuOpened = false;
	}
};
zz.environment.services.MVCRegistry
	.setController(
	    'zz-home-layout' ,
	    zz.home.controllers.Layout );
