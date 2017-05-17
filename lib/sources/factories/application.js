goog.provide( 'zz.home.factories.Application' );
goog.require( 'zz.factories.BaseFactory' );

/**
 * Application data factory.
 * @extends {zz.factories.BaseFactory}
 */
zz.home.factories.Application = class extends zz.factories.BaseFactory{

	constructor( ){

		super( 'zz.home.factories.Application' );
	}

    /**
     * @return {Array}
     */
    getApplicationDataset( ){
        
        return [ [
            'zz.home',
            '0.0.1',
            'Apache-2.0'
        ] ];
    }
};
goog.addSingletonGetter( zz.home.factories.Application );