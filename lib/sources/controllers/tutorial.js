goog.provide( 'zz.home.controllers.Tutorial' );

goog.require( 'goog.dom' );
goog.require( 'goog.json' );
goog.require( 'goog.soy' );
goog.require( 'goog.array' );
goog.require( 'goog.string' );

goog.require( 'zz.home.enums.Const' );
goog.require( 'zz.home.enums.CssClass' );
goog.require( 'zz.home.enums.EventType' );

goog.require( 'zz.home.services.ClientApi' );
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
        
        if( !zz.home.services.ClientApi.getInstance( ).getFullTutorialData( )[ 'en' ].length

            && !zz.home.services.ClientApi.getInstance( ).getFullTutorialData( )[ 'ru' ].length ){

            this.getHandler( ).listenWithScope(

                zz.home.services.ClientApi.getInstance( ),
                zz.home.enums.EventType.DATA_IS_READY,
                this.setupModelInternal,
                false,
                this
            );
        }
	}

	/**
     * @param {zz.home.events.DataIsReady=} opt_e
	 * @override
	 */
	setupModelInternal( opt_e ){

        var data;
        if( opt_e ){

            data = opt_e.data;
        }else{

            data = zz.home.services.ClientApi.getInstance( ).getFullTutorialData( );
        }
	    if( data[ 'ru' ].length
            || data[ 'en' ].length ){


            var route = this.router_.getFragment( );
            var step = route.slice( route.indexOf( '=' ) + 1, route.length );
            goog.array.forEach( data[ 'ru' ], function( item ){

                if( item[ 4 ] ){

                    if( item[ 4 ] === step ){

                        this.getModel( ).createLast( [

                            item[ 0 ],
                            item[ 1 ],
                            item[ 2 ],
                            item[ 3 ],
                            item[ 4 ],
                            item[ 5 ],
                           new Date(  item[ 6 ] ).toLocaleString( ),
                        ] );
                    }
                }
            }, this );

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
};
