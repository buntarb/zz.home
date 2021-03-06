goog.provide( 'zz.home.factories.View' );
goog.require( 'zz.factories.BaseFactory' );

/**
 * Factory.
 * @extends {zz.services.BaseService}
 */
zz.home.factories.View = class extends zz.factories.BaseFactory{

	constructor( ){
		super( 'zz.home.factories.View' )
	}

    getViewDataset( ){
        
        return [ [
        
            0,
            'slogan',
            goog.getCssName( 'slogan' ),
            false,
            false,
            'slogan',
            'imazzine.sdk',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...'
        ],[
                
            1,
            '1',
            goog.getCssName( 'second' ),
            false,
            false,
            'iconClass',
            'Caption',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...'
        ],[
                
            2,
            '2',
            goog.getCssName( 'second' ),
            false,
            false,
            'iconClass',
            'Caption',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...'
        ],[

            3,
            '3',
            goog.getCssName( 'second' ),
            false,
            false,
            'iconClass',
            'Caption',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...'
        ],[

            4,
            '4',
            goog.getCssName( 'second' ),
            false,
            false,
            'iconClass',
            'Caption',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...'
        ],[

            5,
            '5',
            goog.getCssName( 'second' ),
            false,
            false,
            'iconClass',
            'Caption',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...'
        ],[

            6,
            '6',
            goog.getCssName( 'second' ),
            false,
            false,
            'iconClass',
            'Caption',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...'
        ],[

            7,
            '7',
            goog.getCssName( 'second' ),
            false,
            false,
            'iconClass',
            'Caption',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...'
        ],[

            8,
            '8',
            goog.getCssName( 'second' ),
            false,
            false,
            'iconClass',
            'Caption',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...'
        ],[

            9,
            '9',
            goog.getCssName( 'second' ),
            false,
            false,
            'iconClass',
            'Caption',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...'
        ],[

            10,
            '10',
            goog.getCssName( 'second' ),
            false,
            false,
            'iconClass',
            'Caption',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...'
        ] ];
    }
};
goog.addSingletonGetter( zz.home.factories.View );
