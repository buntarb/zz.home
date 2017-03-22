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

goog.provide( 'zz.home.services.DataConverter' );

goog.require( 'goog.array' );
goog.require( 'goog.dom.pattern' );

goog.require( 'zz.services.BaseService' );
goog.require( 'zz.home.models.Tutorial' );

/**
 * Service for filter, sort and convert data.
 * @constructor
 * @extends {zz.services.BaseService}
 */
zz.home.services.DataConverter = function( ){

    goog.base( this, 'zz.home.services.DataConverter' );
};

goog.inherits( zz.home.services.DataConverter, zz.services.BaseService );
goog.addSingletonGetter( zz.home.services.DataConverter );


/**
 * Filter array by hashtag.
 * @param {Array} hashtagArr Array with hashtags.
 * @param {Array} sourceArr Source array for filtering.
 * @return {Object}
 */
zz.home.services.DataConverter.prototype.filterHashtag = function( hashtagArr, sourceArr ){

    var filteredData = {

        'en': [ ],
        'ru': [ ]
    };
    goog.array.forEach( sourceArr, function( item ){

        goog.array.forEach( hashtagArr, function( hashtag ){

            var regExp = new RegExp( 'hashtag\/' + hashtag + '\\?', 'gi');

            if ( goog.dom.pattern.matchStringOrRegex( regExp, item[ 2 ] ) ){

                filteredData[ hashtag ][ filteredData[ hashtag ].length ] = item;
            }
        } );
    } );

    return filteredData;
};

/**
 * Fix facebook id.
 * @param {Array} sourceArr Source array for fixing.
 */
zz.home.services.DataConverter.prototype.fixId = function( sourceArr ){

    goog.array.forEach( sourceArr, function( item ){

        if( item.id.indexOf( '_' ) >= 0 ){

            item.id = item.id.slice( item.id.indexOf( '_' ) + 1, item.id.length );
        }
    });
};

/**
 * Sort data by step.
 * @param {Array} sourceArr Source array for sorting.
 */
zz.home.services.DataConverter.prototype.sortDataByStep = function( sourceArr ){

    goog.array.sort( sourceArr, function( a, b ){

        return a[ 4 ] - b[ 4 ];
    } );
};

/**
 * Sort images by name.
 * @param {Array} sourceArr Source array for sorting.
 */
zz.home.services.DataConverter.prototype.sortImagesByName = function( sourceArr ){

    goog.array.forEach( sourceArr, function( album ){

        goog.array.sort( album.photos.data, function( a, b ){

            return a.name - b.name;
        } );
    } );
};


/**
 * Convert data from FB to tutorial model.
 * @param {Array} sourceArr Source array with data from fb.
 * @param {zz.home.models.Tutorial} model Tutorial model.
 * @return {zz.home.models.Tutorial}
 */
zz.home.services.DataConverter.prototype.fbDataToModel = function( sourceArr, model ){

    goog.array.forEach( sourceArr, function( item ){

        var index = item.message.indexOf( 'hashtag/step' );
        var step;
        if( index > 0 ){

            step = item.message.slice(

                index + 12,
                index + 14 );

        }else{

            step = undefined;
        }

        if( item.message || item.subject){

            model.createLast( [

                item.id,
                item.subject,
                item.message,
                undefined,
                step,
                item.from.name,
                item.created_time
            ] );
        }
    } );

    return model;
};


/**
 * Convert album images from FB to tutorial model.
 * @param {Array} sourceArr Source array with images.
 * @param {zz.home.models.Tutorial} model Tutorial model.
 * @return {zz.home.models.Tutorial}
 */
zz.home.services.DataConverter.prototype.fbImagesToModel = function( sourceArr, model ){

    goog.array.forEach( sourceArr, function( item ){

        var step = item.description.slice(

            4,
            item.description.length );

        var images = [ ];
        goog.array.forEach( item.photos.data, function( photo ){

            images[ images.length ] = [

                photo.id,
                photo.name,
                photo.webp_images[ 3 ].source
            ]
        } );

        model.createLast( [ undefined, undefined, undefined, images, step ] );
    } );

    return model;
};

/**
 * Add album images from FB to all tutorial data.
 * @param {Array} images Array with images.
 * @param {Array} data All tutorial data.
 * @return {Array}
 */
zz.home.services.DataConverter.prototype.addImagesToFBData = function( images, data ){

    goog.array.forEach( data, function( item ){

        goog.array.forEach( images, function( image ){

            if( item[ 4 ] === image[ 4 ] ){

                item[ 3 ] = image[ 3 ];
            }

        }, this );

    }, this );

    return data;
};
