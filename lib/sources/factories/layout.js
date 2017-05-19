goog.provide( 'zz.home.factories.Layout' );
goog.require( 'zz.factories.BaseFactory' );

/**
 * Layout data factory.
 * @extends {zz.factories.BaseFactory}
 */
zz.home.factories.Layout = class extends zz.factories.BaseFactory{

	constructor( ){
		super( 'zz.home.factories.Layout' );
	}

    /**
     * @return {Array}
     */
    getLayoutDataset( ){
        
        return [ [
            'imazzine.tutorial',
            'tutorial',
             [ [
                
                0,
                '/test',
                goog.getCssName( 'test' ),
                false,
                false,
                '',
                'Test'
            ],[
                
                1,
                '/test1',
                goog.getCssName( 'test1' ),
                false,
                false,
                '',
                'Test1'
            ] ],
            true
        ] ];
    }
};
goog.addSingletonGetter( zz.home.factories.Layout );