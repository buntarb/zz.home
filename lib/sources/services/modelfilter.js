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

goog.provide( 'zz.home.services.ModelFilter' );

goog.require( 'goog.dom.pattern' );

goog.require( 'zz.services.BaseService' );
goog.require( 'zz.home.models.Posts' );

/**
 * Service for filter model.
 * @constructor
 * @extends {zz.services.BaseService}
 */
zz.home.services.ModelFilter = function( ){

    goog.base( this, 'zz.home.services.ModelFilter' );
};

goog.inherits( zz.home.services.ModelFilter, zz.services.BaseService );
goog.addSingletonGetter( zz.home.services.ModelFilter );


/**
 * Filter model by hashtag.
 * @param {Array} hashtagArr
 * @param {zz.home.models.Posts} model
 * @return {zz.home.models.Posts}
 */
zz.home.services.ModelFilter.prototype.hashtagFilter = function( hashtagArr, model ){


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
