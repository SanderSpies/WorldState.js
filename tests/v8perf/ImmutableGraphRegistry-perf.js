'use strict';

var perfTest = require('./perfTest');
var ImmutableGraphRegistry = require('../../src/Base/ImmutableGraphRegistry');

perfTest('ImmutableGraphRegistry.getImmutableObject - object',
  function(){
    ImmutableGraphRegistry.getImmutableObject({});
    ImmutableGraphRegistry.getImmutableObject({});
    ImmutableGraphRegistry.getImmutableObject({});
  },
  ImmutableGraphRegistry.getImmutableObject
);

perfTest('ImmutableGraphRegistry.getImmutableObject - array',
  function(){
    ImmutableGraphRegistry.getImmutableObject([]);
    ImmutableGraphRegistry.getImmutableObject([]);
    ImmutableGraphRegistry.getImmutableObject([]);
  },
  ImmutableGraphRegistry.getImmutableObject
);