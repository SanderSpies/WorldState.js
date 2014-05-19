'use strict';

/* @type {ImmutableGraphArray} */
var ImmutableGraphArray = require('./ImmutableGraphArray');
/* @type {ImmutableGraphObject} */
var ImmutableGraphObject = require('./ImmutableGraphObject');
/* @type {ImmutableGraphRegistry} */
var ImmutableGraphRegistry = require('./ImmutableGraphRegistry');


/**
 * @type {ImmutableGraphObject}
 */
ImmutableGraphArray.ImmutableGraphObject = ImmutableGraphObject;


/**
 * @type {ImmutableGraphArray}
 */
ImmutableGraphObject.ImmutableGraphArray = ImmutableGraphArray;


/**
 * @type {ImmutableGraphRegistry}
 */
ImmutableGraphObject.ImmutableGraphRegistry = ImmutableGraphRegistry;


/**
 * @lends {ImmutableGraph}
 */
module.exports = {
  Array: ImmutableGraphArray,
  Object: ImmutableGraphObject
};
