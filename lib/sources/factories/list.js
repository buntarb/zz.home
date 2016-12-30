goog.provide( 'zz.ui.factories.List' );
goog.require( 'zz.factories.BaseFactory' );

/**
 * Dummy data factory.
 * @extends {zz.factories.BaseFactory}
 */
zz.ui.factories.List = class extends zz.factories.BaseFactory{

	constructor( ){
		super( 'zz.ui.factories.List' )
	}

    getDummyDataset( ){
        
        return [ [
            0,
            '0',
            'class0',
            true,
            false,
            goog.getCssName( 'iconExample' ),
            'caption0',
            'description0',
        ],[
            1,
            '1',
            'class1',
            false,
            true,
            goog.getCssName( 'iconExample' ),
            'caption1',
            'description1',
        ],[
            2,
            '2',
            'class2',
            false,
            false,
            goog.getCssName( 'iconExample' ),
            'caption2',
            'description2',
        ],[
            3,
            '3',
            'class3',
            false,
            false,
            goog.getCssName( 'iconExample' ),
            'caption3',
            'description3',
        ] ]
    }
};
goog.addSingletonGetter( zz.ui.factories.List );
