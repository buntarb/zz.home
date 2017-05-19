goog.provide( 'zz.home.controllers.Layout' );

goog.require( 'goog.Timer' );

goog.require( 'zz.home.services.FBDataClient' );

goog.require( 'zz.home.models.Layout' );
goog.require( 'zz.home.factories.Layout' );
goog.require( 'zz.home.views.Layout' );

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
    fadeoutViewInternal( ){}

    /**
     * Add view controller.
     * @param {Function} ViewCtrl
     * @protected
     * @override
     */
    setViewInternal( ViewCtrl ){}

    /**
     * Remove view controller.
     * @protected
     * @override
     */
    removeViewInternal( ){}

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
