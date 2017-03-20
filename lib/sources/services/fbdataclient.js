// Copyright 2016 Artem Lytvynov <buntarb@gmail.com>. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */

goog.provide( 'zz.home.services.FBDataClient' );

goog.require( 'goog.json' );
goog.require( 'goog.events.EventHandler' );

goog.require( 'zz.services.BaseService' );

goog.require( 'zz.net.models.MessageDataset' );
goog.require( 'zz.net.enums.EventType' );
goog.require( 'zz.home.enums.Command' );
goog.require( 'zz.home.enums.EventType' );
goog.require( 'zz.home.enums.CssClass' );

goog.require( 'zz.home.services.Router' );
goog.require( 'zz.home.services.SocketClient' );
goog.require( 'zz.home.services.Settings' );
goog.require( 'zz.home.services.DataConverter' );

goog.require( 'zz.home.events.DataIsConverted' );
goog.require( 'zz.home.events.DataIsReady' );
goog.require( 'zz.home.models.FBServerApi' );

goog.require( 'zz.environment.services.Environment' );

/**
 * Service for client api methods.
 * @constructor
 * @extends {zz.services.BaseService}
 */
zz.home.services.FBDataClient = function( ){

    goog.base( this, 'zz.home.services.FBDataClient' );

    this.wsc_ = zz.home.services.SocketClient
    
        .getInstance( )
        .getClient( );

    this.fullTutorialData_ = {

        'en': [ ],
        'ru': [ ]
    };

    this.tutorialImages_ = [ ];

    this.setupListenersInternal( );
};

goog.inherits( zz.home.services.FBDataClient, zz.services.BaseService );
goog.addSingletonGetter( zz.home.services.FBDataClient );

/**
 * @override
 */
zz.home.services.FBDataClient.prototype.setupListenersInternal = function( ){

    /**
     * Service event handler.
     * @type {goog.events.EventHandler}
     * @private
     */
    this.eventHandler_ = new goog.events.EventHandler( );

    // websocket listener.
    this.eventHandler_.listenWithScope(

        this.wsc_,
        zz.home.enums.Command.GET_DOCS,
        this.getDataListener_,
        false,
        this
    );

    this.eventHandler_.listenWithScope(

        this.wsc_,
        zz.home.enums.Command.GET_IMAGES,
        this.getImagesListener_,
        false,
        this
    );
};

/**
 * Getdocs from fb handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.home.services.FBDataClient.prototype.getDataListener_ = function( e ){

    var dataset = new zz.net.models.MessageDataset( null, e.messageData );
    var datarow = dataset.firstDatarow( );

    var arr = goog.json.parse( datarow.data )[ 0 ][ 2 ];

    var hashtagArr = [

        'ru',
        'en'
    ];

    this.fullTutorialData_ = zz.home.services.DataConverter.getInstance( ).hashtagFilter( hashtagArr, arr );

    zz.home.services.DataConverter.getInstance( ).sortDataByStep( this.fullTutorialData_[ 'en' ] );
    zz.home.services.DataConverter.getInstance( ).sortDataByStep( this.fullTutorialData_[ 'ru' ] );

    this.dispatchEvent( new zz.home.events.DataIsConverted( this.fullTutorialData_ ) );
};

/**
 * Getimages from fb handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.home.services.FBDataClient.prototype.getImagesListener_ = function( e ){

    var dataset = new zz.net.models.MessageDataset( null, e.messageData );
    var datarow = dataset.firstDatarow( );

    this.tutorialImages_ = goog.json.parse( datarow.data )[ 0 ][ 2 ];

    if( this.fullTutorialData_[ 'en' ].length

        || this.fullTutorialData_[ 'ru' ].length ){

        this.dataIsConvertedListener_( );

    }else{

        //TODO: use listenOnce?
        this.eventHandler_.listenWithScope(

            this,
            zz.home.enums.EventType.DATA_IS_CONVERTED,
            this.dataIsConvertedListener_,
            false,
            this
        );
    }
};

/**
 * Data is converted listener.
 * @param {zz.home.events.DataIsConverted=} opt_e
 * @private
 */
zz.home.services.FBDataClient.prototype.dataIsConvertedListener_ = function( opt_e ){

    zz.home.services.DataConverter.getInstance( ).addImagesToFBData(

        this.tutorialImages_,
        this.fullTutorialData_[ zz.home.services.Settings.getInstance( ).getUserLanguage( ) ]
    );

    this.dispatchEvent(

        new zz.home.events.DataIsReady(

            this.getTutorialModelData( )
        )
    );
};

/**
 * Get full tutorial data.
 * @return {Object}
 */
zz.home.services.FBDataClient.prototype.getFullTutorialData = function( ){

    return this.fullTutorialData_;
};

/**
 * Get tutorial data for tutorial model by current tutorial step.
 * @return {Array}
 */
zz.home.services.FBDataClient.prototype.getTutorialModelData = function( ){

    var data = [ ];
    var step = zz.home.services.Router.getInstance( ).getTutorialStep( );

    goog.array.forEach(

        this.fullTutorialData_[ zz.home.services.Settings.getInstance( ).getUserLanguage( ) ],
        function( item ){

            if( item[ 4 ] ){

                if( item[ 4 ] === step ){

                    data[ data.length ] = [

                        item[ 0 ],
                        item[ 1 ],
                        item[ 2 ],
                        item[ 3 ],
                        item[ 4 ],
                        item[ 5 ],
                        new Date(  item[ 6 ] ).toLocaleString( ),
                    ]
                }
            }
        } );

    return data;
};

/**
 * Get tutorial data for menu model.
 * @return {Array}
 */
zz.home.services.FBDataClient.prototype.getTutorialMenuModelData = function( ){

    var data = [ ];

    goog.array.forEach(

        this.fullTutorialData_[ zz.home.services.Settings.getInstance( ).getUserLanguage( ) ],
        function( item ){

        data[ data.length ] = [

          undefined,
          '/tutorial?step=' + item[ 4 ],
          zz.home.enums.CssClass.TUTORIAL,
          undefined,
          false,
          undefined,
          'step#' + item[ 4 ]
        ]
    } );

    return data;
};


/**
 * Get posts from FB.
 */
zz.home.services.FBDataClient.prototype.getPosts = function( ){

    var model = new zz.home.models.FBServerApi( );
    model.createLast( );
    this.wsc_.sendCommandMessage( zz.home.enums.Command.GET_POSTS, model );
};

/**
 * Get documents from FB.
 */

zz.home.services.FBDataClient.prototype.requestTutorial = function( ){

    var model = new zz.home.models.FBServerApi( );
    model.createLast( );

    this.wsc_.sendCommandMessage( zz.home.enums.Command.REQUEST_TUTORIAL, model );
};
