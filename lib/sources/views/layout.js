goog.provide( 'zz.home.views.Layout' );
goog.require( 'zz.views.FEBase' );
goog.require( 'zz.home.templates.layout' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'goog.dom.classlist' );

/**
 * View.
 * @extends {zz.views.FEBase}
 */
zz.home.views.Layout = class extends zz.views.FEBase{

	constructor( ){
		super(
		    zz.home.templates.layout.model,
		    zz.home.templates.layout.dataset,
		    zz.home.templates.layout.datarow );
	}
	
	/**
	 * @param {Element} element
	 */
	isLogo( element ){
	    
	    return goog.dom.classlist.contains(
	        element,
	        goog.getCssName( 'mdl-layout__drawer-button' ) );
	}
	
	/**
	 * @param {Element} element
	 */
	isTitle( element ){
	    
	    return goog.dom.classlist.contains(
	        element,
	        goog.getCssName( 'mdl-layout-title' ) );
	}
	
	/**
	 * @param {Element} element
	 */
	isObfuscator( element ){
	    
	    return goog.dom.classlist.contains(
	        element,
	        goog.getCssName( 'mdl-layout__obfuscator' ) );
	}
	
	/**
	 * @param {zz.home.contollers.Layout} controller
	 */
	fadeoutView( controller ){
	    
	    var element = goog.dom.getElementByClass(
	        goog.getCssName( 'mdl-layout__content' ),
	        controller.getElement( ) );
	    
	    goog.style.setStyle(
	        element,
	        'margin-bottom',
	        '-100%' );
	        
	    goog.style.setStyle(
	        element,
	        'margin-top',
	        '100%' );
	    goog.style.setStyle(
	        element,
	        'opacity',
	        '0' );
	}
	
	/**
	 * @param {zz.home.contollers.Layout} controller
	 */
	fadeinView( controller ){
	    
	    var element = goog.dom.getElementByClass(
	        goog.getCssName( 'mdl-layout__content' ),
	        controller.getElement( ) );
	    
	    goog.style.setStyle(
	        element,
	        'margin-top',
	        '0' );
	    goog.style.setStyle(
	        element,
	        'opacity',
	        '1' );
	        
	    goog.Timer.callOnce( function( ){
	        
	        goog.style.setStyle(
    	        element,
    	        'margin-bottom',
    	        '' );
	    }, 100 );
	    
	}
};
goog.addSingletonGetter( zz.home.views.Layout );
zz.environment.services.MVCRegistry
	.setView( 'zz-home-layout' , zz.home.views.Layout );