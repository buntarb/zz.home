goog.provide( 'zz.home.controllers.Layout' );

goog.require( 'goog.dom.pattern' );
goog.require( 'goog.Timer' );

goog.require( 'zz.home.services.FBDataClient' );

goog.require( 'zz.home.models.Layout' );
goog.require( 'zz.home.factories.Layout' );
goog.require( 'zz.home.views.Layout' );

goog.require( 'zz.home.enums.CssClass' );
goog.require( 'zz.ui.enums.EventType' );

goog.require( 'zz.net.enums.EventType' );
goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.app.controllers.FELayoutController' );
goog.require( 'zz.environment.services.MVCRegistry' );


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
	bootstrap( ){}

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
     * @param {string} title
     * @param {string=} opt_menuTitle
	 */
	updateTitle( title, opt_menuTitle ){

        this
            .getModel( )
            .firstDatarow( )
            .title =
            'imazzine.' +
            title;

        if( opt_menuTitle ){

            this
                .getModel( )
                .firstDatarow( )
                .menuTitle =
                'zz.' +
                opt_menuTitle;
		}else{

            this
                .getModel( )
                .firstDatarow( )
                .menuTitle =
                'zz.' +
                title;
		}
	}

	/**
	 * Update active link.
	 */
	updateActiveLink( ){

          this.updateActiveMenuLink( );
          this.updateActiveNavLink( );
	}

	/**
	 * Update navigation model according current route.
	 */
	updateActiveNavLink( ){
	    
	    var navigation = this
	        .getModel( )
	        .firstDatarow( )
	        .navigation;
	    
	    var link = navigation.firstDatarow( );
	    do{

            link.active = this

                .getRootController( )
                .getRouter( )
                .isNavLinkActive( link.id );

	        
	    }while( link = navigation.nextDatarow( ) );
	}
	
	/**
	 * Update menu model according current route.
	 */
	updateActiveMenuLink( ){
	    
	    var menu = this
	        .getModel( )
	        .firstDatarow( )
	        .menu;
	    
	    var link = menu.firstDatarow( );
	    do{

	        link.active = this

	                .getRootController( )
	                .getRouter( )
	                .isMenuLinkActive( link.id );

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

	/**
	 * Update menu
	 * @param {array} data
	 */
	updateMenu( data ){

		var menuModel = this.getModel( ).lastDatarow( ).menu;

		if( menuModel.length ){

			while( menuModel.deleteCurrent( ) ){}
		}

		goog.array.forEach( data, function( item ){

			menuModel.createLast( item );
		} );
	}
};
zz.environment.services.MVCRegistry
	.setController(
	    'zz-home-layout' ,
	    zz.home.controllers.Layout );
