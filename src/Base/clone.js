'use strict';

var isArray = Array.isArray;


/**
 *
 * @param {{}} obj
 * @return {{}}
 * @private
 */
function _cloneObject(obj) {
  var newObj = {};
  var keys = Object.keys(obj);
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    newObj[key] = obj[key];
  }
  return newObj;
}

/**
 * Clone an object
 *
 * @param {{}} obj
 * @return {[]|{}}
 */
function clone(obj) {
  if (isArray(obj)) {
    return obj.slice();
  }
  else {
    return _cloneObject(obj);
  }
}

module.exports = clone;
