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

        this.fullData_ = {

        	'en': [ ],
			'ru': [ ]
		};
	}

	/**
	 * @override
	 */
	setupListenersInternal( ){


        this.wsc_ = this
            .getRootController( )
            .getWSClient( );

        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.home.enums.Command.GET_DOCS,
            this.getDataHandler_,
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
	bootstrap( ){ }

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

        this.fullData_ = zz.home.services.DataConverter.getInstance( ).hashtagFilter( hashtagArr, arr );

        zz.home.services.DataConverter.getInstance( ).sortDataByStep( this.fullData_[ 'en' ] );
        zz.home.services.DataConverter.getInstance( ).sortDataByStep( this.fullData_[ 'ru' ] );
		this.getModel( ).createLast( [

			this.fullData_[ 'ru' ][ 0 ][ 0 ],
            this.fullData_[ 'ru' ][ 0 ][ 1 ],
            this.fullData_[ 'ru' ][ 0 ][ 2 ],
            this.fullData_[ 'ru' ][ 0 ][ 3 ],
            this.fullData_[ 'ru' ][ 0 ][ 4 ]
        ] );
        this.getView( ).renderDocs( this.getModel( ) );
    }
};
