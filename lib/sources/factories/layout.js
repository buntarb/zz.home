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
     * @returns {Array}
     */
    getLayoutDataset( ){
        
        return [ [
            'zz-home-layout',
            'icon',
            'imazzine.home',
            'home',
            false, [ [
                
                0,
                '/home',
                goog.getCssName( 'home' ),
                false,
                false,
                '',
                'Home'
            ],[
                
                1,
                '/tutorial',
                goog.getCssName( 'tutorial' ),
                false,
                false,
                '',
                'Tutorial'
            ],[
                
                2,
                '/guide',
                goog.getCssName( 'guide' ),
                false,
                false,
                '',
                'Developer guide'
            ],[
                
                2,
                '/reference',
                goog.getCssName( 'reference' ),
                false,
                false,
                '',
                'Reference API'
                
            ] ],[]/*,[ [
                
                0,
                '/home',
                goog.getCssName( 'home' ),
                false,
                false,
                '',
                'Home'
            ],[
                
                1,
                '/tutorial',
                goog.getCssName( 'tutorial' ),
                false,
                false,
                '',
                'Tutorial'
            ],[
                
                2,
                '/guide',
                goog.getCssName( 'guide' ),
                false,
                false,
                '',
                'Developer guide'
            ],[
                
                2,
                '/reference',
                goog.getCssName( 'reference' ),
                false,
                false,
                '',
                'Reference API'
                
            ] ]*/,
            false,
            true
        ] ];
    }
};
goog.addSingletonGetter( zz.home.factories.Layout );