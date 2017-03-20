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

goog.provide( 'zz.home.services.Settings' );

goog.require( 'zz.services.BaseService' );

goog.require( 'zz.environment.services.Environment' );

/**
 * Service for settings.
 * @constructor
 * @extends {zz.services.BaseService}
 */
zz.home.services.Settings = function( ){

    goog.base( this, 'zz.home.services.Settings' );

    this.wsc_ = zz.home.services.SocketClient
    
        .getInstance( )
        .getClient( );

    this.userLanguage_;
};

goog.inherits( zz.home.services.Settings, zz.services.BaseService );
goog.addSingletonGetter( zz.home.services.Settings );

/**
 * Get user language.
 * @return {string}
 */
zz.home.services.Settings.prototype.getUserLanguage = function( ){

    return this.userLanguage_;
};

/**
 * Set user language.
 * @param {string} lang
 */
zz.home.services.Settings.prototype.setUserLanguage = function( lang ){

    this.userLanguage_ = lang;
};