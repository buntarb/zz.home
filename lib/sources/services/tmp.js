goog.provide( 'services.tmp' );
goog.require( 'zz.services.BaseService' );

/**
 * Service.
 * @extends {zz.services.BaseService}
 */
services.tmp = class extends zz.services.BaseService{

	constructor( ){
		super( 'services.tmp' )
	}

};
goog.addSingletonGetter( services.tmp );
