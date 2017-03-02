goog.provide( 'zz.home.views.View' );
goog.require( 'zz.home.templates.view' );
goog.require( 'zz.ui.views.List' );
goog.require( 'goog.style' );

/**
 * View (root controller) view.
 * @extends {zz.views.FEBase}
 */
zz.home.views.View = class extends zz.ui.views.List{

	constructor( ){
		super(
		    zz.home.templates.view.model,
		    zz.home.templates.view.dataset,
		    zz.home.templates.view.datarow );
	}
	
	/**
	 * @param {number} uid
	 * @returns {Element}
	 */
	getDatasetElement( uid ){
	    
	    return this
	        .getMVCRegistry( )
	        .get( uid )
	        .elements[ 0 ];
	}
	
	/**
	 * @param {number} uid
	 * @returns {Element}
	 */
	getDatarowElement( uid ){
	    
	    return this
	        .getMVCRegistry( )
	        .get( uid )
	        .elements[ 0 ];
	}
	
	/**
	 * @param {Element} element
	 * @returns {goog..math.Size}
	 */
	getWraperSize( element ){
	    
	    return goog.style.getSize(
	        goog.dom.getParentElement( 
	            goog.dom.getParentElement( element ) ) );
	}
	
	/**
	 * @param {number} uid
	 * @param {number} width
	 */
	setViewWidth( uid, width ){
	    
	    goog.style.setWidth(
	        this.getDatasetElement( uid ),
	        width );
	}
	
	/**
	 * @param {number} uid
	 * @param {number} height
	 */
	setItemHeight( uid, height ){
	    
	    goog.style.setHeight(
	        this.getDatarowElement( uid ),
	        height );
	}
	
	/**
	 * @param {number} uid
	 * @param {number} width
	 */
	setItemWidth( uid, width ){
	    
	    goog.style.setWidth(
	        this.getDatarowElement( uid ),
	        width );
	}
};
goog.addSingletonGetter( zz.home.views.View );