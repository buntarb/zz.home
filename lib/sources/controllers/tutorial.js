goog.provide( 'zz.home.controllers.Tutorial' );

goog.require( 'goog.dom' );
goog.require( 'goog.json' );
goog.require( 'goog.soy' );
goog.require( 'goog.array' );
goog.require( 'goog.string' );

goog.require( 'zz.home.enums.Const' );
goog.require( 'zz.home.enums.CssClass' );

goog.require( 'zz.home.services.ClientApi' );
goog.require( 'zz.home.services.DataConverter' );

goog.require( 'zz.home.models.Tutorial' );
goog.require( 'zz.home.views.Tutorial' );

goog.require( 'zz.net.models.MessageDataset' );
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


        this.wsc_ = this
            .getRootController( )
            .getWSClient( );

        this.router_ = this

            .getRootController( )
            .getRouter( );

        this.layout_ = this

            .getRootController( )
            .getLayoutController( );

        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.home.enums.Command.GET_DOCS,
            this.getDataHandler_,
            false,
            this
        );

        this.getHandler( ).listen(

            this.router_,
            zz.environment.enums.EventType.ROUTED,
            this.routeChangedHandler_,
            false,
            this
        );
	}

	/**
	 * @override
	 */
	setupModelInternal( ){

        zz.home.services.ClientApi.getInstance( ).getDocs( );
	}

	/**
	 * @override
	 */
	bootstrap( ){}

    /**
     * Route changed event handler.
     * @param {zz.environment.events.Routed} e
     * @private
     */
    routeChangedHandler_( e ){

        this.setTutorialStep_( );
    }

    /**
     * Getdocs handler
     * @param {zz.net.events.WebSocketClientMessage} e
     * @private
     */
    getDataHandler_( e ){

        //console.log(  e.messageData );
        var dataset = new zz.net.models.MessageDataset( null, e.messageData );
        var datarow = dataset.firstDatarow( );

        var arr = goog.json.parse( datarow.data )[ 0 ][ 2 ];

        var hashtagArr = [

            'ru',
			'en'
        ];

        var fullData = zz.home.services.DataConverter.getInstance( ).hashtagFilter( hashtagArr, arr );

        zz.home.services.DataConverter.getInstance( ).sortDataByStep( fullData[ 'en' ] );
        zz.home.services.DataConverter.getInstance( ).sortDataByStep( fullData[ 'ru' ] );

        goog.object.forEach( fullData, function( arr, key ){

            goog.array.forEach( arr, function( item ){

                this.layout_.setFullTutorialData( key, item );
            }, this );

        }, this );

        this.setTutorialStep_( );
        this.getView( ).renderDocs( this.getModel( ) );
    }

    /**
     * Set current tutorial step
     * @private
     */
    setTutorialStep_(  ){

        var route = this.router_.getFragment( );
        var step = route.slice( route.indexOf( '=' ) + 1, route.length );
        var menuModel = this.layout_.getModel( ).lastDatarow( ).menu;
        while( menuModel.deleteCurrent( ) ){}
        goog.array.forEach( this.layout_.getFullTutorialData( )[ 'ru' ], function( item ){

            if( item[ 4 ] ){

                if( item[ 4 ] === step ){

                    this.getModel( ).createLast( [

                        item[ 0 ],
                        item[ 1 ],
                        item[ 2 ],
                        item[ 3 ],
                        item[ 4 ],
                    ] );
                    menuModel.createLast( [

                        undefined,
                        '/tutorial?step=' + item[ 4 ],
                        undefined,
                        true,
                        false,
                        undefined,
                        'step#' + item[ 4 ]
                    ] );
                }else{

                    menuModel.createLast( [

                        undefined,
                        '/tutorial?step=' + item[ 4 ],
                        undefined,
                        undefined,
                        false,
                        undefined,
                        'step#' + item[ 4 ]
                    ] );
                }
            }
        }, this );
    }
};
