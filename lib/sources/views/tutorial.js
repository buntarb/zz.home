goog.provide( 'zz.home.views.Tutorial' );
goog.require( 'zz.home.templates.tutorial' );
goog.require( 'zz.views.FEBase' );

/**
 * Tutorial view.
 * @extends {zz.views.FEBase}
 */
zz.home.views.Tutorial = class extends zz.views.FEBase{

	constructor( ){
		super(
		    zz.home.templates.tutorial.model );
	}

    /**
     * Render docs html.
	 * @param {zz.home.models.Tutorial} model
     */
    renderDocs( model ){

        var element = goog.dom.getElementByClass( zz.home.enums.CssClass.TUTORIAL_DOC_MESSAGE );

        if( model.lastDatarow( ).message ){

			goog.soy.renderHtml(

				element,
				model.currentDatarow( ).message
			);
		}
	}

    /**
     * Render images.
     * @param {zz.home.models.Tutorial} model
     */
    renderImages( model ){

    	var images = model.lastDatarow( ).images;
        if( images.length ){

            var tutorial = goog.dom.getElementByClass( zz.home.enums.CssClass.TUTORIAL_DOC );
            var elements = tutorial.getElementsByTagName( zz.home.enums.Const.IMG );

            var image;
            var i = 0;
            if( image = images.firstDatarow( ) ){

            	do{

            		elements[ i ].setAttribute( zz.home.enums.Const.SRC, image.source );
                    elements[ i ].removeAttribute(zz.home.enums.Const.WIDTH );
                    elements[ i ].removeAttribute(zz.home.enums.Const.HEIGHT );
            		i++;
				}while( image = images.nextDatarow( ) )
			}
        }
    }
};
goog.addSingletonGetter( zz.home.views.Tutorial );