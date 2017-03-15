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
                '/tutorial?step=00',
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
                
            ] ],
            undefined,
            false,
            true
        ] ];
    }

    /**
     * @return {Array}
     */
    getMenuLinkHome( ){

        return [

            0,
            '/home',
            goog.getCssName( 'home' ),
            false,
            false,
            '',
            'Home'
        ];
    }

    /**
     * @return {Array}
     */
    getMenuLinkTutorial( ){

        return [

            1,
            '/tutorial?step=00',
            goog.getCssName( 'tutorial' ),
            false,
            false,
            '',
            'Tutorial'
        ];
    }

    /**
     * @return {Array}
     */
    getMenuLinkGuide( ){

        return [

            2,
            '/guide',
            goog.getCssName( 'guide' ),
            false,
            false,
            '',
            'Developer guide'
        ];
    }

    /**
     * @return {Array}
     */
    getMenuLinkReference( ){

        return [

            2,
            '/reference',
            goog.getCssName( 'reference' ),
            false,
            false,
            '',
            'Reference API'
        ];
    }


};
goog.addSingletonGetter( zz.home.factories.Layout );