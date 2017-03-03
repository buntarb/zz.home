// This file was autogenerated by idk compile models.
// Please do not edit.

goog.provide( 'zz.home.models.Posts' );
goog.provide( 'zz.home.models.PostsDatarow' );

goog.require( 'zz.models.Datarow' );
goog.require( 'zz.models.Dataset' );
goog.require( 'zz.models.enums.FieldType' );



/**
* @param {!zz.models.Dataset} dataset
* @param {?Array.<string>} opt_data
* @extends {zz.models.Datarow}
* @constructor
*/
zz.home.models.PostsDatarow = function( dataset, opt_data ){

    /**
     * @type {string}
     */
    this.message = undefined;

    /**
     * @type {string}
     */
    this.image = undefined;

    /**
     * @type {string}
     */
    this.video = undefined;



/**
* Call parent constructor.
*/
zz.models.Datarow.call( this, dataset, opt_data );
};

goog.inherits( zz.home.models.PostsDatarow, zz.models.Datarow );

/**
* @param {goog.event.EventTarget=} opt_parent
* @param {Array.<Array>=} opt_data
* @extends {zz.models.Dataset}
* @constructor
*/
zz.home.models.Posts = function( opt_parent, opt_data ){

zz.models.Dataset.call( this, opt_parent, opt_data );
};
goog.inherits( zz.home.models.Posts, zz.models.Dataset );

/**
* Current dataset row type.
* @constructor
* @overwrite
* @type {zz.home.models.PostsDatarow}
*/
zz.home.models.Posts.prototype.DatarowConstructor = zz.home.models.PostsDatarow;

/**
* Return zz.home.models.PostsDatarow schema object.
* @override
* @returns {Object}
*/
zz.home.models.Posts.prototype.getDatarowSchema = function( ){

return {
        message: {
                index: 0,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        image: {
                index: 1,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        video: {
                index: 2,
                type: zz.models.enums.FieldType.STRING,
                required: false
        }
};
};