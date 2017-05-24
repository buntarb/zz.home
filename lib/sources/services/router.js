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

goog.provide( 'zz.home.services.Router' );

goog.require( 'goog.json' );
goog.require( 'goog.events.EventHandler' );

goog.require( 'zz.app.services.FERouter' );

/**
 * Router.
 * @constructor
 * @extends {zz.app.services.FERouter}
 */
zz.home.services.Router = function( ){

    goog.base( this, 'zz.home.services.Router' );
};

goog.inherits( zz.home.services.Router, zz.app.services.FERouter );
goog.addSingletonGetter( zz.home.services.Router );

/**
 * Get tutorial step.
 * @return {string|undefined}
 */
zz.home.services.Router.prototype.getTutorialStep = function( ){

    var step;
    var route = this.getFragment( );

    if( route.indexOf( 'tutorial' ) >= 0 ){

        step = route.slice( route.indexOf( '=' ) + 1, route.length );
    }

    return step;
};

/**
 * Check if the current menu link is active.
 * @params {string} linkId Link URL.
 * @return {boolean}
 */
zz.home.services.Router.prototype.isMenuLinkActive = function( linkId ){

    return this.getFragment( ).indexOf( linkId ) >= 0;
};