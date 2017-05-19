goog.provide( 'zz.ui.controllers.List' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * Controller.
 * @extends {zz.controllers.FEBase}
 */
zz.ui.controllers.List = class extends zz.controllers.FEBase{

    /**
     * @param {zz.ui.models.List} model
     * @param {zz.ui.views.List} view
     * @param {boolean} opt_suppressAction
     */
	constructor( model, view, opt_suppressAction ){
	    
		super( model, view );
		
		/**
		 * @type {boolean}
		 */
		this.suppressAction_ = opt_suppressAction || false;
	}

	/**
	 * @override
	 */
	setupListenersInternal( ){}

	/**
	 * @override
	 */
	setupModelInternal( ){ }

	/**
	 * @override
	 */
	bootstrap( ){ }
};
zz.environment.services.MVCRegistry
	.setController(
	    'zz-ui-list' ,
	    zz.ui.controllers.List );