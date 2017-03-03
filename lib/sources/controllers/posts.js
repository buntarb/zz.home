goog.provide( 'zz.home.controllers.Posts' );

goog.require( 'goog.json' );

goog.require( 'zz.home.services.ClientApi' );
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

        var dataset = new zz.net.models.MessageDataset( null, e.messageData );
        var datarow = dataset.firstDatarow( );
        var arr = goog.json.parse( datarow.data )[ 0 ][ 2 ];

        goog.array.forEach( arr, function( item ){

        	this.getModel( ).createLast( [ item[ 0 ] ] );

		}, this );

        if( goog.DEBUG ){

            console.log( 'get posts handler', arr );
		}
	}
};
