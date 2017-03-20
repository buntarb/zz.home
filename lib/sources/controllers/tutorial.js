goog.provide( 'zz.home.controllers.Tutorial' );

goog.require( 'goog.dom' );
goog.require( 'goog.json' );
goog.require( 'goog.soy' );
goog.require( 'goog.array' );
goog.require( 'goog.string' );

goog.require( 'zz.home.enums.Const' );
goog.require( 'zz.home.enums.CssClass' );
goog.require( 'zz.home.enums.EventType' );

goog.require( 'zz.home.services.FBDataClient' );
goog.require( 'zz.home.models.Tutorial' );
goog.require( 'zz.home.views.Tutorial' );

goog.require( 'zz.app.controllers.FEViewController' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'zz.environment.services.Environment' );
/**
 * Controller.
 * @extends {zz.controllers.FEBase}
 */
zz.home.controllers.Tutorial =

    class extends zz.app.controllers.FEViewController{

	constructor( ){
		super(
			new zz.home.models.Tutorial( ),
			zz.home.views.Tutorial.getInstance( ) );
	}

	/**
	 * @override
	 */
	setupListenersInternal( ){

        this.router_ = this

            .getRootController( )
            .getRouter( );

        this.layout_ = this

            .getRootController( )
            .getLayoutController( );
        
        if( !zz.home.services.FBDataClient.getInstance( ).getFullTutorialData( )[ 'en' ].length

            && !zz.home.services.FBDataClient.getInstance( ).getFullTutorialData( )[ 'ru' ].length ){

            this.getHandler( ).listenWithScope(

                zz.home.services.FBDataClient.getInstance( ),
                zz.home.enums.EventType.DATA_IS_READY,
                this.dataIsReadyListener_,
                false,
                this
            );
        }
	}

	/**
	 * @override
	 */
	setupModelInternal( ){

        var data = zz.home.services.FBDataClient

                .getInstance( )
                .getTutorialModelData( );

	    if( data.length ){

             goog.array.forEach( data, function( item ){

                    this.getModel( ).createLast( item );
                 }
            , this );

            this.getView( ).renderDocs( this.getModel( ) );
            this.getView( ).renderImages( this.getModel( ) );

            this.layout_.setTutorialMenu( );
            this.layout_.setActiveMenuLink( );
        }
    }

	/**
	 * @override
	 */
	bootstrap( ) {}

    /**
     *
     * @param {zz.home.events.DataIsReady} e
     */
    dataIsReadyListener_( e ){

        this.setupModelInternal( );
    }
};
