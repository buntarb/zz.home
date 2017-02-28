goog.provide( 'zz.home.controllers.Posts' );

goog.require( 'zz.home.services.ClientApi' );
goog.require( 'zz.home.models.Posts' );
goog.require( 'zz.home.views.Posts' );

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

		this.wsc_ = zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getWSClient( );
	}

	/**
	 * @override
	 */
	setupListenersInternal( ){

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

		console.log( 'getposts handler', e );
	}
};
