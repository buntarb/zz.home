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

goog.require( 'zz.app.services.FEBaseRouter' );

/**
 * Router.
 * @constructor
 * @extends {zz.app.services.FEBaseRouter}
 */
zz.home.services.Router = function( ){

    goog.base( this, 'zz.home.services.Router' );

    /**
     * Active layout controller.
     * @type {zz.controllers.FEBase}
     * @private
     */
    this.layoutController_ = null;

    /**
     * Active view controller.
     * @type {zz.controllers.FEBase}
     * @private
     */
    this.viewController_ = null;
};

goog.inherits( zz.home.services.Router, zz.app.services.FEBaseRouter );
goog.addSingletonGetter( zz.home.services.Router );

/**
 * Set root application controller.
 * @param {zz.app.controllers.FERootController} rootController
 * @return {zz.home.services.Router}
 */
zz.home.services.Router.prototype.setRootController = function( rootController ){

    /**
     * Root application controller.
     * @type {zz.app.controllers.FERootController}
     */
    this.rootController_ = rootController;
    return this;
};

//noinspection JSUnusedGlobalSymbols
/**
 * Define route as string and related view controller constructor.
 * constructor.
 * @param {string} route
 * @param {Function} layoutControllerConstructor
 * @param {Function} viewControllerConstructor
 * @returns {zz.app.services.FEBaseRouter}
 */
zz.home.services.Router.prototype.when = function(
    route, layoutControllerConstructor, viewControllerConstructor ){

    if( goog.DEBUG ){

        goog.asserts.assertFunction(
            layoutControllerConstructor,
            'zz.home.services.Router#when: ' +
            'layoutControllerConstructor should ' +
            'be View constructor function.' );

        goog.asserts.assertFunction(
            viewControllerConstructor,
            'zz.home.services.Router#when: ' +
            'viewControllerConstructor should ' +
            'be View constructor function.' );
    }
    this.setRoute( route, {

        layoutControllerConstructor: layoutControllerConstructor,
        viewControllerConstructor: viewControllerConstructor
    } );
    return this;
};

/**
 * Process new route.
 * @param {Object} config
 * @override
 */
zz.home.services.Router.prototype.processRoute = function( config ){

    if( !this.layoutController_ ||
        !( this.layoutController_ instanceof config.layoutControllerConstructor ) ){

        if ( this.layoutController_ ){

            this.layoutController_.dispose( );
            this.layoutController_ = undefined;
        }
        this.layoutController_ = new config.layoutControllerConstructor( );
        this.rootController_.addChild( this.layoutController_, false );
        this.layoutController_.render( this.rootController_.getLayoutWrapper( ) );
    }
    if( !this.viewController_ ||
        !( this.viewController_ instanceof config.viewControllerConstructor ) ){

        this.layoutController_.setViewController( config.viewControllerConstructor );
    }
};

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