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

goog.provide( 'zz.home.services.DataFilter' );

goog.require( 'goog.dom.pattern' );

goog.require( 'zz.services.BaseService' );
goog.require( 'zz.home.models.Posts' );

/**
 * Service for filter model.
 * @constructor
 * @extends {zz.services.BaseService}
 */
zz.home.services.DataFilter = function( ){

    goog.base( this, 'zz.home.services.DataFilter' );
};

goog.inherits( zz.home.services.DataFilter, zz.services.BaseService );
goog.addSingletonGetter( zz.home.services.DataFilter );


/**
 * Filter model by hashtag.
 * @param {Array} hashtagArr
 * @param {zz.home.models.Posts} model
 * @return {zz.home.models.Posts}
 */
zz.home.services.DataFilter.prototype.hashtagFilter = function( hashtagArr, model ){


    var filteredModel = new zz.home.models.Posts( );

    if( model.firstDatarow( ) ){

        do{

            var hasHashtags = false;
            var loop = true;
            var datarow = model.currentDatarow( );

            goog.array.forEach( hashtagArr, function( hashtag ){

                var regExp = new RegExp( hashtag + '\\b', 'gi'  );

                if( loop && goog.dom.pattern.matchStringOrRegex( regExp, datarow.message ) ){

                    hasHashtags = true;
                    console.log( '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', datarow.message );
                }else{

                    hasHashtags = false;
                    loop = false;
                }
            });
            if( hasHashtags ){

                filteredModel.createLast( [ datarow.message, datarow.image, datarow.video ] );
            }

        }while( model.nextDatarow( ) );
    }

    return filteredModel;
};


/**
 * Bubble sort data from FB by Id.
 * @param {Array} data
 * @return {Array}
 */
zz.home.services.DataFilter.prototype.sortDataByIdBubble = function( data ){

    var tmp;

    for( var i = data.length - 1; i > 0; i-- ){

        var counter = 0;
        for( var j = 0; j < i; j++ ){

            if( data[ j ].id < data[ j+1 ].id ){

                tmp = data[ j ];
                data[ j ] = data[ j+1 ];
                data[ j+1 ] = tmp;
                counter++;
            }
        }
        if( counter == 0 ){

            break;
        }
    }

    return data;
};
