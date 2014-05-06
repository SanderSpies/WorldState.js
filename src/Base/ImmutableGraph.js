'use strict';

var ImmutableGraphArray = require('./ImmutableGraphArray');
var ImmutableGraphObject = require('./ImmutableGraphObject');
var ImmutableGraphRegistry = require('./ImmutableGraphRegistry');

ImmutableGraphArray.ImmutableGraphObject = ImmutableGraphObject;
ImmutableGraphArray.ImmutableGraphRegistry = ImmutableGraphRegistry;
ImmutableGraphObject.ImmutableGraphArray = ImmutableGraphArray;
ImmutableGraphObject.ImmutableGraphRegistry = ImmutableGraphRegistry;

module.exports = {
  Array: ImmutableGraphArray,
  Object: ImmutableGraphObject
};