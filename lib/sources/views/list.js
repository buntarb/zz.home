goog.provide( 'zz.ui.views.List' );
goog.require( 'zz.ui.templates.list' );
goog.require( 'zz.views.FEBase' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'goog.dom' );
goog.require( 'goog.dom.classlist' );
goog.require( 'goog.array' );

/**
 * List view.
 * @extends {zz.views.FEBase}
 */
zz.ui.views.List = class extends zz.views.FEBase{

	constructor( opt_model, opt_dataset, opt_datarow ){
		super(
		    opt_model || zz.ui.templates.list.model,
		    opt_dataset || zz.ui.templates.list.dataset,
		    opt_datarow || zz.ui.templates.list.datarow )
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
	 * @param {number} uid
	 * @returns {Element}
	 */
	getIconWrapper( uid ){
	    
	    return goog.dom.getElementByClass(
	        goog.getCssName( 'icon' ),
	        this.getDatarowElement( uid ) );
	}
	
	/**
	 * @param {number} uid
	 * @returns {Element}
	 */
	getContentWrapper( uid ){
	    
	    return goog.dom.getElementByClass(
	        goog.getCssName( 'content' ),
	        this.getDatarowElement( uid ) );
	}
	
	/**
	 * @param {number} uid
	 * @param {string} className
	 */
	setIconClass( uid, className ){
	    
	    var el = this.getIconWrapper( uid );
	    var classes = goog.dom.classlist.get( el );
	    goog.array.forEach( classes, function( c ){
	        
	        if( c !== goog.getCssName( 'icon' ) )
    	        goog.dom.classlist.remove( el, c );
	    } );
	    goog.dom.classlist.add( el, className );
	}
	
	/**
	 * @param {zz.ui.controllers.List} controller
	 * @param {string} className
	 */
	addSelector( controller, className ){
	    
	    goog.dom.classlist.add(
	        this.getDatasetElement(
	            controller.getModel( ).getUid( ) ),
	        className );
	}
	
	/**
	 * @param {zz.ui.controllers.List} controller
	 * @param {string} className
	 */
	removeSelector( controller, className ){
	    
	    goog.dom.classlist.remove(
	        this.getDatasetElement(
	            controller.getModel( ).getUid( ) ),
	        className );
	}
};
goog.addSingletonGetter(
    zz.ui.views.List );
zz.environment.services.MVCRegistry
	.setView(
	    'zz-ui-list' ,
	    zz.ui.views.List );