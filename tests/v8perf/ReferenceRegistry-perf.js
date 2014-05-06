'use strict';

var ReferenceRegistry = require('../../src/Base/ReferenceRegistry');

var perfTest = require('./perfTest');

perfTest('ReferenceRegistry.getReferenceTo', function(){
  ReferenceRegistry.getReferenceTo({bla:(1)|0});
  ReferenceRegistry.getReferenceTo({bla:(2)|0});
  ReferenceRegistry.getReferenceTo({bla:(3)|0});
}, ReferenceRegistry.getReferenceTo);

var resolveObjectData = {
  shoppingCard: {
    items: [
      {
        id: (1)|0,
        title: 'stuff a'
      },
      {
        id: (2)|0,
        title: 'stuff b',
        fans: [
          {
            id: (3)|0,
            name: 'bla'
          }
        ]
      }
    ]
  }
};

perfTest('ReferenceRegistry.resolveObject', function(){
  ReferenceRegistry.resolveObject(resolveObjectData);
  ReferenceRegistry.resolveObject(resolveObjectData);
  ReferenceRegistry.resolveObject(resolveObjectData);
}, ReferenceRegistry.resolveObject);