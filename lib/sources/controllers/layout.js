goog.provide( 'zz.home.controllers.Layout' );

goog.require( 'goog.json' );
goog.require( 'goog.dom.pattern' );
goog.require( 'goog.Timer' );

goog.require( 'zz.home.services.ClientApi' );
goog.require( 'zz.home.services.DataConverter' );

goog.require( 'zz.home.models.Layout' );
goog.require( 'zz.home.factories.Layout' );
goog.require( 'zz.home.views.Layout' );
goog.require( 'zz.home.events.DataIsConverted' );
goog.require( 'zz.home.events.DataIsReady' );

goog.require( 'zz.home.enums.CssClass' );
goog.require( 'zz.ui.enums.EventType' );

goog.require( 'zz.net.models.MessageDataset' );
goog.require( 'zz.net.enums.EventType' );
goog.require( 'zz.app.controllers.FELayoutController' );
goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.environment.enums.EventType' );
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

        this.fullTutorialData_ = {

            'en': [ ],
            'ru': [ ]
        };

        this.tutorialImages_ = [ ];
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
        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.home.enums.Command.GET_DOCS,
            this.getDataListener_,
            false,
            this
        );

        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.home.enums.Command.GET_IMAGES,
            this.getImagesListener_,
            false,
            this
        );

        if( !this.wsc_.isReady( ) ){

            this.getHandler( ).listenWithScope(

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
	 * Getdocs from fb handler.
	 * @param {zz.net.events.WebSocketClientMessage} e
	 * @private
	 */
	getDataListener_( e ){

		var dataset = new zz.net.models.MessageDataset( null, e.messageData );
		var datarow = dataset.firstDatarow( );

		var arr = goog.json.parse( datarow.data )[ 0 ][ 2 ];

		var hashtagArr = [

			'ru',
			'en'
		];

		this.fullTutorialData_ = zz.home.services.DataConverter.getInstance( ).hashtagFilter( hashtagArr, arr );

		zz.home.services.DataConverter.getInstance( ).sortDataByStep( this.fullTutorialData_[ 'en' ] );
		zz.home.services.DataConverter.getInstance( ).sortDataByStep( this.fullTutorialData_[ 'ru' ] );

        this.dispatchEvent( new zz.home.events.DataIsConverted( this.fullTutorialData_ ) );
	}

	/**
	 * Getimages from fb handler.
	 * @param {zz.net.events.WebSocketClientMessage} e
	 * @private
	 */
	getImagesListener_( e ){

		var dataset = new zz.net.models.MessageDataset( null, e.messageData );
		var datarow = dataset.firstDatarow( );

		this.tutorialImages_ = goog.json.parse( datarow.data )[ 0 ][ 2 ];

        if( this.fullTutorialData_[ 'en' ].length

            || this.fullTutorialData_[ 'ru' ].length ){

            this.dataIsConvertedListener_( );

        }else{

            //TODO: use listenOnce?
            this.getHandler( ).listenWithScope(

                this,
                zz.home.enums.EventType.DATA_IS_CONVERTED,
                this.dataIsConvertedListener_,
                false,
                this
            );
		}

	}

	/**
	 * Data is converted listener.
	 * @param {zz.home.events.DataIsConverted=} opt_e
	 * @private
	 */
	dataIsConvertedListener_( opt_e ){

        zz.home.services.DataConverter.getInstance( ).addImagesToFBData(

            this.tutorialImages_,
            this.fullTutorialData_[ 'ru' ]
        );

        if( goog.DEBUG ){

            console.log( this.fullTutorialData_ );
        }
        this.dispatchEvent( new zz.home.events.DataIsReady( this.fullTutorialData_ ) );
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

		goog.array.forEach( this.fullTutorialData_[ 'ru' ], function( item ){

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

	/**
	 * Get full tutorial data
	 * @return {Object}
	 */
	getFullTutorialData( ){

		return this.fullTutorialData_;
	}

	/**
	 * Set full tutorial data
     * @param {string} hashtag
     * @param {Object} value
	 * @return {Object}
	 */
	setFullTutorialData( hashtag, value ){

		this.fullTutorialData_[ hashtag ][ this.fullTutorialData_[ hashtag ].length ] = value;
	}
};
zz.environment.services.MVCRegistry
	.setController(
	    'zz-home-layout' ,
	    zz.home.controllers.Layout );
