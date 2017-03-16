goog.provide( 'zz.home.controllers.Layout' );

goog.require( 'goog.dom.pattern' );
goog.require( 'goog.Timer' );

goog.require( 'zz.home.services.ClientApi' );

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

        this.router_ = this

            .getRootController( )
            .getRouter( );


        this.wsc_ = this

            .getRootController( )
            .getWSClient( );


	    // Router listener.
        this
            .getHandler( )
            .listenWithScope(

                this.router_,
                zz.environment.enums.EventType.ROUTED,
                this.routeChangedListener_,
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

        // websocket listener.
        if( !this.wsc_.isReady( ) ){

            this
                .getHandler( ).listenWithScope(

                this.wsc_,
                zz.net.enums.EventType.WEB_SOCKET_READY,
                this.webSocketReadyListener_,
                false,
                this
            );
        }
	}

	/**
	 * @override
	 */
	setupModelInternal( ){


	}

	/**
	 * @override
	 */
	bootstrap( ){

        if( this.wsc_.isReady( ) ){

            this.webSocketReadyListener_( );
        }
		this.routeChangedListener_( );
	}

	/**
	 * Websocket ready event handler.
	 * @param {zz.net.events.WebSocketClientReady=} opt_e
	 * @private
	 */
	webSocketReadyListener_( opt_e ){

        zz.home.services.ClientApi.getInstance( ).getDocs( );
        zz.home.services.ClientApi.getInstance( ).getImages( );
    }
	/**
	 * Route changed event handler.
	 * @param {zz.environment.events.Routed=} opt_e
	 * @private
	 */
	routeChangedListener_( opt_e ){

		if( opt_e ){

			if( !goog.dom.pattern.matchStringOrRegex( /tutorial/g , opt_e.getCurrFragment( ) )

            	&& goog.dom.pattern.matchStringOrRegex( /tutorial/g, opt_e.getPrevFragment( ) ) ){

                this.setDefaultMenu( );
			}

            if( !goog.dom.pattern.matchStringOrRegex( /tutorial/g , opt_e.getCurrFragment( ) ) ){

                this.setActiveMenuLink( );
            }

		}else{

			if( !goog.dom.pattern.matchStringOrRegex( /tutorial/g , this.router_.getFragment( ) ) ){

                this.setDefaultMenu( );
                this.setActiveMenuLink( );
			}
		}

		this.updateTitle( );
		this.setActiveNavLink( );
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
	                .getRootController( )
	                .getRouter( )
	                .getFragment( ) ){

	        	var title;
	        	if( link.id.indexOf( '?' ) >= 0 ){

	        		title = link.id.slice( 1, link.id.indexOf( '?' ) );
				}else{

	        		title = link.id.split( '/' )[ 1 ];
				}
                this
                    .getModel( )
                    .firstDatarow( )
                    .title =
                        'imazzine.' +
						title;
                
                this
                    .getModel( )
                    .firstDatarow( )
                    .menuTitle =
                        'zz.' +
                        title;
            }
	    }while( link = navigation.nextDatarow( ) );
	}
	
	/**
	 * Update navigation model according current route.
	 */
	setActiveNavLink( ){
	    
	    var navigation = this
	        .getModel( )
	        .firstDatarow( )
	        .navigation;
	    
	    var link = navigation.firstDatarow( );
	    do{

	        link.active =

				( this.getRootController( ).getRouter( ).getFragment( ).indexOf( link.id ) >= 0 );

	        
	    }while( link = navigation.nextDatarow( ) );
	}
	
	/**
	 * Update menu model according current route.
	 */
	setActiveMenuLink( ){
	    
	    var menu = this
	        .getModel( )
	        .firstDatarow( )
	        .menu;
	    
	    var link = menu.firstDatarow( );
	    do{

	        link.active = link.id ===
	            this
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

	/**
	 * Set default menu
	 */
	setDefaultMenu( ){



		var menuModel = this.getModel( ).lastDatarow( ).menu;

		if( menuModel.length ){

            while( menuModel.deleteCurrent( ) ){}
		}

		menuModel.createLast(

            zz.home.factories.Layout
                .getInstance( )
				.getMenuLinkHome( )
		);
        menuModel.createLast(

            zz.home.factories.Layout
                .getInstance( )
                .getMenuLinkTutorial( )
        );
        menuModel.createLast(

            zz.home.factories.Layout
                .getInstance( )
                .getMenuLinkGuide( )
        );
        menuModel.createLast(

            zz.home.factories.Layout
                .getInstance( )
                .getMenuLinkReference( )
        );
	}

	/**
	 * Set tutorial menu.
	 */
	setTutorialMenu( ){

		var menuModel = this.getModel( ).lastDatarow( ).menu;

        if( menuModel.length ){

            while( menuModel.deleteCurrent( ) ){}
        }

		goog.array.forEach( zz.home.services.ClientApi.getInstance( ).getFullTutorialData( )[ 'ru' ], function( item ){

            menuModel.createLast( [

                undefined,
                '/tutorial?step=' + item[ 4 ],
                zz.home.enums.CssClass.TUTORIAL,
                undefined,
                false,
                undefined,
                'step#' + item[ 4 ]
            ] );
		} );
	}
};
zz.environment.services.MVCRegistry
	.setController(
	    'zz-home-layout' ,
	    zz.home.controllers.Layout );
