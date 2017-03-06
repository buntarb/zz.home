goog.provide( 'zz.home.controllers.Posts' );

goog.require( 'goog.json' );

goog.require( 'zz.home.services.ClientApi' );
goog.require( 'zz.home.services.DataFilter' );
goog.require( 'zz.home.models.Posts' );
goog.require( 'zz.home.views.Posts' );

goog.require( 'zz.net.models.MessageDataset' );
goog.require( 'zz.app.controllers.FEViewController' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'zz.environment.services.Environment' );
/**
 * Controller.
 * @extends {zz.controllers.FEBase}
 */
zz.home.controllers.Posts =

    class extends zz.app.controllers.FEViewController{

	constructor( ){
		super(
			new zz.home.models.Posts( ),
			zz.home.views.Posts.getInstance( ) );

		this.fullModel_ = new zz.home.models.Posts( );
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
            zz.home.enums.Command.GET_POSTS,
            this.getPostsHandler_,
            false,
            this
        );
	}

	/**
	 * @override
	 */
	setupModelInternal( ){

		zz.home.services.ClientApi.getInstance( ).getPosts( );
	}

	/**
	 * @override
	 */
	bootstrap( ){}

	/**
	 * Getposts handler
	 * @param {zz.net.events.WebSocketClientMessage} e
	 * @private
	 */
	getPostsHandler_( e ){

        console.log(  e.messageData );
        var dataset = new zz.net.models.MessageDataset( null, e.messageData );
        var datarow = dataset.firstDatarow( );

        var arr = goog.json.parse( datarow.data )[ 0 ][ 2 ];

        var hashtagArr = [

            '#ru',
            '#tutorial'
        ];

        goog.array.forEach( arr, function( item ){

        	this.fullModel_.createLast( [ item[ 0 ], item[ 1 ], item[ 2 ] ] );

		}, this );

        if( goog.DEBUG ){

          //console.log( 'get posts handler', arr );
		}
        zz.home.services.DataFilter.getInstance( ).hashtagFilter( hashtagArr, this.fullModel_, this.getModel( ) );
	}
};
