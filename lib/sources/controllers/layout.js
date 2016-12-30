goog.provide( 'zz.home.controllers.Layout' );
goog.require( 'zz.home.models.Layout' );
goog.require( 'zz.home.factories.Layout' );
goog.require( 'zz.home.views.Layout' );

goog.require( 'zz.ui.enums.EventType' );

goog.require( 'zz.app.controllers.FEViewController' );
goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * Controller.
 * @extends {zz.app.controllers.FEViewController}
 */
zz.home.controllers.Layout = class extends zz.app.controllers.FEViewController{

	constructor( ){
		super(
			new zz.home.models.Layout(
			    undefined,
			    zz.home.factories.Layout
			        .getInstance( )
			        .getLayoutDataset( ) ),
			zz.home.views.Layout
			    .getInstance( ) );
			
		this.render( this
		    .getEnvironment( )
		    .getRootController( )
		    .getLayoutWrapper( ) );
	}

	/**
	 * @override
	 */
	setupListenersInternal( ){
	    
	    this
	        .getHandler( )
	        .listenWithScope(
	            
	            this
	                .getEnvironment( )
	                .getRootController( )
	                .getRouter( ),
                zz.environment.enums.EventType.ROUTED,
                this.updateActiveLink,
                false,
                this
	        );
	    
	    this
	        .getHandler( )
	        .listenWithScope(
	        
	            this,
	            zz.controllers.enums.EventType.ACTION,
	            this.actionListener_,
	            false,
	            this );
        
        this
            .getHandler( )
            .listenWithScope(
                
                this.getNavigationController( ),
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
