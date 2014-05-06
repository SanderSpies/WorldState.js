'use strict';

var perfTest = require('./perfTest');
var clone = require('../../src/Base/clone');

var foo = {
  title: 'Sander',
  items: [

  ],
  bar: {
    name: 'x',
    items: [
      {
        id: (1)|0,
        title: 'sdfsd'
      }
    ]
  }
};

perfTest('clone',
  function () {
    clone(foo);
    clone(foo);
    clone(foo);
  },
  clone
);
