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

        var element = goog.dom.getElementByClass( zz.home.enums.CssClass.TUTORIAL_MESSAGE );

        if( model.lastDatarow( ).message ){

			goog.soy.renderHtml(

				element,
				model.currentDatarow( ).message
			);
		}
	}
};
goog.addSingletonGetter( zz.home.views.Tutorial );