goog.provide( 'zz.home.factories.Tutorial' );

goog.require( 'goog.net.XhrIo' );
goog.require( 'goog.Promise' );
goog.require( 'goog.json' );

goog.require( 'zz.factories.BaseFactory' );

/**
 * Layout data factory.
 * @extends {zz.factories.BaseFactory}
 */
zz.home.factories.Tutorial = class extends zz.factories.BaseFactory{

	constructor( ){
		super( 'zz.home.factories.Tutorial' );
	}

    /**
     * Get json file.
     * @return {goog.Promise}
     */
	getJson( ){

        return ( new goog.Promise( function( resolve, reject ){

            goog.net.XhrIo.send(

                zz.home.enums.Const.DATA_FILE_PATH,
                function( ){

                    var data = this.getResponseJson( );
                    resolve( data );
                }
            );
        }, this ) );
    }
};
goog.addSingletonGetter( zz.home.factories.Tutorial );