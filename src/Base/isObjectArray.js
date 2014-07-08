'use strict';

var isArray = Array.isArray;

function isObjectArray(arr) {
  return (isArray(arr) && arr.length && typeof arr[0] === 'object') || (isArray(arr) && arr.length === 0);
}

module.exports = isObjectArray;
