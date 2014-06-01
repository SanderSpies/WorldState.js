'use strict';

var ReferenceRegistry = require('../../src/Base/ReferenceRegistry');

var perfTest = require('./perfTest');

perfTest('ReferenceRegistry.getReferenceTo', function(){
  ReferenceRegistry.getReferenceTo({bla:1});
  ReferenceRegistry.getReferenceTo({bla:2});
  ReferenceRegistry.getReferenceTo({bla:3});
}, ReferenceRegistry.getReferenceTo);

var resolveObjectData = {
  shoppingCard: {
    items: [
      {
        id: 1,
        title: 'stuff a'
      },
      {
        id: 2,
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

perfTest('ReferenceRegistry.findReference', function() {
  var ref = ReferenceRegistry.resolveObject({aap:1});
  //var ref2 = ReferenceRegistry.resolveObject({aap:2});
  ReferenceRegistry.findReference(ref.ref);
  ReferenceRegistry.findReference(ref.ref);
  ReferenceRegistry.findReference(ref.ref);
  ReferenceRegistry.findReference(ref.ref);
  ReferenceRegistry.findReference(ref.ref);


  //ReferenceRegistry.findReference(ref.ref);
}, ReferenceRegistry.findReference);