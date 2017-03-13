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

goog.provide( 'zz.home.events.DataWasGot' );
goog.require( 'zz.events.BaseEvent' );
goog.require( 'zz.ui.enums.EventType' );

/**
 * After layout controller have got data from fb, it dispatch this event class.
 * @param {Object} data
 * @extends {zz.events.BaseEvent}
 * @constructor
 */
zz.home.events.DataWasGot = function( data ){

	goog.base( this, zz.ui.enums.EventType.DATA_WAS_GOT);

	/**
	 * Data from fb.
	 * @type {Object}
	 */
	this.data = data;
};
goog.inherits( zz.home.events.DataWasGot, zz.events.BaseEvent );