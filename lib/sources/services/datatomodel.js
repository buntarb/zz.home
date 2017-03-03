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

goog.provide( 'zz.home.services.DataToModel' );

goog.require( 'zz.services.BaseService' );
goog.require( 'zz.home.models.Posts' );

/**
 * Service for converting data to model.
 * @constructor
 * @extends {zz.services.BaseService}
 */
zz.home.services.DataToModel = function( ){

    goog.base( this, 'zz.home.services.DataToModel' );
};

goog.inherits( zz.home.services.DataToModel, zz.services.BaseService );
goog.addSingletonGetter( zz.home.services.DataToModel );


/**
 * Convert data from FB to posts model.
 * @param {Array} data
 * @param {zz.home.models.Posts} model
 * @return {zz.home.models.Posts}
 */
zz.home.services.DataToModel.prototype.FBDataToModel = function( data, model ){

   goog.array.forEach( data, function( item ){

        if( item.message ){

            model.createLast( [ item.message, item.full_picture, item.source ] );
        }
    });

    //console.log( "model!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", model );
    return model;
};
