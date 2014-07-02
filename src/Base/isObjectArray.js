'use strict';

var isArray = Array.isArray;

function isObjectArray(arr) {
  return isArray(arr) && arr.length && typeof arr[0] === 'object';
}

module.exports = isObjectArray;
