goog.provide( 'zz.home.controllers.Tutorial' );

goog.require( 'goog.dom' );
goog.require( 'goog.json' );
goog.require( 'goog.soy' );
goog.require( 'goog.array' );
goog.require( 'goog.string' );

goog.require( 'zz.home.enums.Const' );
goog.require( 'zz.home.enums.CssClass' );
goog.require( 'zz.home.enums.EventType' );

goog.require( 'zz.home.factories.Tutorial' );
goog.require( 'zz.home.services.FBDataClient' );
goog.require( 'zz.home.models.Tutorial' );
goog.require( 'zz.home.views.Tutorial' );

goog.require( 'zz.app.controllers.FEViewController' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'zz.environment.services.Environment' );

/**
 * Tutorial controller.
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

        this.layout_ = this

            .getRootController( )
            .getLayoutController( );
        
        if( !zz.home.services.FBDataClient

                .getInstance( )
                .getAllTutorialData( )[

                    this.getRootController( )

                        .getSettings( )
                        .getUserLanguage( )
                ].length ){

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

        zz.home.factories.Tutorial.getInstance( ).getJson( )

            .then( function( result ){

                var allLangData = goog.json.parse( result );

                var data = zz.home.services.FBDataClient //this method was rewritten

                        .getInstance( )
                        .getCurrentTutorialData( allLangData );

                if( data.length ){

                    this.getModel( ).createLast( data );

                    this.getView( ).renderDocs( this.getModel( ) );
                    this.getView( ).renderImages( this.getModel( ) );

                    this.layout_.updateMenu(

                        zz.home.services.FBDataClient //this method was rewritten

                            .getInstance( )
                            .getTutorialMenuModelData( allLangData )
                    );
                    this.layout_.updateTitle( zz.home.enums.Const.TUTORIAL_TITLE );
                    this.layout_.updateActiveLink( );
                }
            }, undefined, this );
    }

	/**
	 * @override
	 */
	bootstrap( ) {}

    /**
     * This listener will call when the tutorial data is ready.
     * @param {zz.home.events.DataIsReady} e
     */
    dataIsReadyListener_( e ){

        this.setupModelInternal( );
    }
};
