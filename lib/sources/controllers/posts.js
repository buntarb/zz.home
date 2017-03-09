goog.provide( 'zz.home.controllers.Posts' );

goog.require( 'goog.dom' );
goog.require( 'goog.json' );
goog.require( 'goog.soy' );
goog.require( 'goog.array' );
goog.require( 'goog.string' );

goog.require( 'zz.home.enums.Const' );
goog.require( 'zz.home.enums.CssClass' );

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
        this.postsModel_ = new zz.home.models.Posts( );
        this.docsModel_ = new zz.home.models.Posts( );

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

        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.home.enums.Command.GET_DOCS,
            this.getDocsHandler_,
            false,
            this
        );
	}

	/**
	 * @override
	 */
	setupModelInternal( ){

        zz.home.services.ClientApi.getInstance( ).getDocs( );
        //zz.home.services.ClientApi.getInstance( ).getPosts( );
	}

	/**
	 * @override
	 */
	bootstrap( ){ }

	/**
	 * Getposts handler
	 * @param {zz.net.events.WebSocketClientMessage} e
	 * @private
	 */
	getPostsHandler_( e ){

        var dataset = new zz.net.models.MessageDataset( null, e.messageData );
        var datarow = dataset.firstDatarow( );

        var arr = goog.json.parse( datarow.data )[ 0 ][ 2 ];

        var hashtagArr = [

            '#ru',
            '#tutorial'
        ];

        goog.array.forEach( arr, function( item ){

        	this.postsModel_.createLast( [ item[ 0 ], item[ 1 ], item[ 2 ], item[ 3 ], item[ 4 ], false ] );
		}, this );

        zz.home.services.DataFilter.getInstance( ).hashtagFilter( hashtagArr, this.postsModel_, this.getModel( ) );
	}

    /**
     * Getdocs handler
     * @param {zz.net.events.WebSocketClientMessage} e
     * @private
     */
    getDocsHandler_( e ){

        console.log(  e.messageData );
        var dataset = new zz.net.models.MessageDataset( null, e.messageData );
        var datarow = dataset.firstDatarow( );

        var arr = goog.json.parse( datarow.data )[ 0 ][ 2 ];

        var hashtagArr = [

            '#ru',
            '#tutorial'
        ];

        goog.array.forEach( arr, function( item ){

            this.docsModel_.createLast( [ item[ 0 ], item[ 1 ], item[ 2 ], item[ 3 ], item[ 4 ], true ] );

        }, this );

        zz.home.services.DataFilter.getInstance( ).sortModelsById( [ this.docsModel_ ], this.fullModel_ );
        zz.home.services.DataFilter.getInstance( ).hashtagFilter( hashtagArr, this.fullModel_, this.getModel( ) );
        this.renderDocs_( );
    }

        /**
         * Render docs html.
         * @private
         */
        renderDocs_( ){

        	var model = this.getModel( );
        	var docArr = goog.dom.getElementsByClass( zz.home.enums.CssClass.POST_DOCUMENT );

        	if( model.firstDatarow( ) ){

        		do{
                    goog.array.forEach( docArr, function( element ){

                        if( element.getAttribute( zz.home.enums.Const.DATA_ID ) === model.currentDatarow( ).id ){

                            if( model.currentDatarow( ).message ){

                                // goog.string.replaceAll(
                                //
                                //     model.currentDatarow( ).message,
                                //     '/hashtag/',
                                //     'facebook.com/hashtag/'
                                // );
                                goog.soy.renderHtml(

                                    goog.dom.getElementByClass( zz.home.enums.CssClass.POST_MESSAGE, element ),
                                    model.currentDatarow( ).message
                                );
                            }
                        }
                    }, this );

				}while( model.nextDatarow( ) );
			}
        }
};
