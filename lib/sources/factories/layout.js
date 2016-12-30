goog.provide( 'zz.home.factories.Layout' );
goog.require( 'zz.factories.BaseFactory' );
//   index:

//     index: 0
//     type: zz.models.enums.FieldType.NUMBER
//     required: false

//   id:

//     index: 1
//     type: zz.models.enums.FieldType.STRING
//     required: false

//   class:

//     index: 2
//     type: zz.models.enums.FieldType.STRING
//     required: false
    
//   active:
    
//     index: 3
//     type: zz.models.enums.FieldType.BOOLEAN
//     required: false
    
//   disable:
    
//     index: 4
//     type: zz.models.enums.FieldType.BOOLEAN
//     required: false

//   icon:

//     index: 5
//     type: zz.models.enums.FieldType.STRING
//     required: false

//   caption:

//     index: 6
//     type: zz.models.enums.FieldType.STRING
//     required: false

//   description:

//     index: 7
//     type: zz.models.enums.FieldType.STRING
//     required: false
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
            false, [ [
                
                0,
                '/',
                'home',
                false,
                false,
                '',
                'Home'
            ],[
                
                1,
                '/tutorial',
                'tutorial',
                false,
                false,
                '',
                'Tutorial'
            ],[
                
                2,
                '/guide',
                'guide',
                false,
                false,
                '',
                'Developer guide'
            ],[
                
                2,
                '/reference',
                'reference',
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
};
goog.addSingletonGetter( zz.home.factories.Layout );