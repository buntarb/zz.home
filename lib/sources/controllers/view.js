goog.provide( 'zz.home.controllers.View' );

goog.require( 'zz.home.views.View' );
goog.require( 'zz.home.factories.View' );
goog.require( 'zz.home.services.GoldenMath' );

goog.require( 'zz.ui.models.List' );
goog.require( 'zz.ui.controllers.List' );
goog.require( 'zz.ui.enums.EventType' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * Controller.
 * @extends {zz.controllers.FEBase}
 */
zz.home.controllers.View =
    class extends zz.ui.controllers.List{

	constructor( ){
		super(
			new zz.ui.models.List( ),
			zz.home.views.View.getInstance( ) );
	            
	    // this
	    //     .getView( )
	    //     .setDatafieldFilter(
	    //         this.getModel( ).datafield.caption,
	    //         function( modelValue ){
	    //
	    //             var e = goog.dom.createElement( 'div' );
	    //             goog.dom.setTextContent( e, modelValue );
	    //             return e;
	    //         },
	    //         function( viewValue ){
	    //
	    //             return goog.isArray( viewValue ) ?
	    //                 goog.dom.getTextContent( viewValue[ 0 ] ) :
	    //                 viewValue;
	    //         } );
	            
        window[ 'model' ] = this.getModel();
		
		/**
		 * @type {zz.home.services.GoldenMath}
		 */
		this.goldenMath_ = zz.home.services.GoldenMath.getInstance( );
	}
	
	/**
	 * Update items elements width.
	 * @private
	 */
	updateWidth_( ){
	    
	    var widthSet = this.goldenMath_.getRandomWidthSet(
                
            this.goldenSize_.width,
            this.getModel( ).length );
            
        var index = 0;
        var item = this.getModel( ).firstDatarow( );
        while( item ){
            
            this
                .getView( )
                .setItemWidth( 
                    item.getUid( ),
                    widthSet[ index ] );
                
            index++;
            item = this.getModel( ).nextDatarow( );
        }
	}
    
    /**
     * Listener for create model event.
     * @param {zz.models.events.DatarowCreate} event
     * @private
     */
    datarowCreateListener_( event ){

        // If current model was changed...
        if( this.getModel( ).getUid( ) ===
            event.message.dataset.getUid( ) ){
            
            console.log( '!' );
            this
                .getView( )
                .setItemHeight(
                    event.message.datarow.getUid( ),
                    this.goldenMath_
                        .getGoldenInner(
                            this.goldenSize_.height ) );
                            
            // this
            //     .getView( )
            //     .setItemWidth(
            //         event.message.datarow.getUid( ),
            //         this.goldenMath_
            //             .getGoldenInner(
            //                 this.goldenSize_.width ) );
            this.updateWidth_( );
        }
    }
    
    /**
     * Listener for item action event.
     * @param {zz.ui.events.ListItemAction} event
     * @private
     */
    listItemActionListener_( event ){
        
        console.log( event );
    }
    
    /**
     * Listener for update model event.
     * @param {zz.models.events.DatarowUpdate} event
     * @private
     */
    datarowUpdateListener_( event ){ }

	/**
	 * @override
	 */
	setupListenersInternal( ){
	    
	    super.setupListenersInternal( );
	    this.getHandler( ).listen(

            this.getModel( ),
            zz.models.enums.EventType.DATAROW_CREATE,
            this.datarowCreateListener_ );
            
        this.getHandler( ).listen(

            this,
            zz.ui.enums.EventType.LIST_ITEM_ACTION,
            this.listItemActionListener_ );
	}

	/**
	 * @override
	 */
	setupModelInternal( ){

        this.layout_ = this

            .getRootController( )
            .getLayoutController( );

        goog.array.forEach(

        	zz.home.factories.View

				.getInstance( )
				.getViewDataset( ),

			function( item ){

				this
					.getModel( )
					.createLast( item );
		}, this );

        this.layout_.setDefaultMenu( );
        this.layout_.setActiveMenuLink( );
	}

	/**
	 * @override
	 */
	bootstrap( ){

	    /**
	     * @type {goog.math.Size}
	     */
	    this.wrapperSize_ = this.getView( ).getWraperSize(
	        this.getElement( ) );
	        
	    /**
	     * @type {goog.math.Size}
	     */
	    this.goldenSize_ = this.goldenMath_.getGoldenSize(
            this.wrapperSize_.width, 
            this.wrapperSize_.height );
	    
	    this
	        .getView( )
	        .setViewWidth( 
	            this.getModel( ).getUid( ),
	            this.goldenSize_.width );
	}
};
