'use strict';

function _indexOf(array, item) {
  for (var i = 0, l = array.length; i < l; i++) {
    var arrayItem = array[i];
    if (arrayItem === item) {
      return i;
    }
  }
  return -1;
}

module.exports = _indexOf;
