goog.provide( 'zz.home.services.SocketClient' );
goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.services.BaseService' );

/**
 * Service.
 * @extends {zz.services.BaseService}
 */
zz.home.services.SocketClient = class extends zz.services.BaseService{

	constructor( ){
	    
		super( );
		
		var wssUrl = 'ws://'

            +  window[ 'WS_SERVER_HOST' ]
            + ':'
            + window[ 'WS_SERVER_PORT' ]
            + window[ 'WS_SERVER_PATH' ];
        /**
         * Web socket client.
		 * @type {zz.net.WebSocketClient}
		 */   
        this.wsc_ = new zz.net.WebSocketClient( wssUrl );
	}

    /**
     * Return web socket client.
     * @return {zz.net.WebSocketClient}
     */
    getClient( ){

        return this.wsc_;
    }
};
goog.addSingletonGetter( zz.home.services.SocketClient );
