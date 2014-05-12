'use strict';

var ImmutableGraphRegistry = require('../src/Base/ImmutableGraphRegistry');

describe('WorldState.js', function() {

  it('should be able to create an immutable object', function() {
    // test 1
    var testData = {
      text: 'oh hai'
    };
    var imo1 = ImmutableGraphRegistry.getImmutableObject(testData);
    expect(imo1.read().text).toBe('oh hai');
  });

  it('should be possible for two objects to have the same value', function() {
    var testData2 = {
      foo: [
        {
          id: 1,
          bar: 'woop woop'
        }
      ]
    };

    var imo2 = ImmutableGraphRegistry.getImmutableObject(testData2);
    var imo3 = imo2.wrapped().foo;
    expect(imo3.wrapped()[0].read()).toBe(imo2.read().foo.ref[0].ref);
  });

  it('should be possible to change the value of an object', function() {
    var testData2 = {
      foo: [
        {
          id: 1,
          bar: 'woop woop'
        }
      ]
    };
    var imo2 = ImmutableGraphRegistry.getImmutableObject(testData2);
    var imo3 = imo2.wrapped().foo;
    imo3.changeValueTo({
      bla: {
        x: '33'
      }
    });
    expect(imo3.wrapped().bla.read()).toBe(imo2.wrapped().foo.wrapped().bla.read());
  });

  it('should properly recreate all parent objects', function() {
    var testData = {
      items: [
        {
          bla: {
            items: [
              {
                hello: 'world'
              }
            ]
          },
          sibling: {
            foo: 'bar'
          }
        }
      ],
      otherArea: {
        item: {}
      },
      andAnother: {
        boeja: {}
      }
    };
    var imo = ImmutableGraphRegistry.getImmutableObject(testData);
    var deepItem = imo.wrapped().items.wrapped()[0].wrapped().bla.wrapped().
        items.wrapped()[0];
    var otherAreaItem = imo.wrapped().otherArea.wrapped();

    // here we make sure that the same object is used
    otherAreaItem.item.changeReferenceTo(deepItem.read());

    // caching old values
    var oldObj1 = imo.read().items.ref[0].ref.sibling;
    var oldObj2 = imo.read().items.ref;
    var old3 = deepItem.__private.refToObj.ref;
    var old4 = imo.wrapped().otherArea.read();
    var old5 = imo.wrapped().andAnother.read();

    deepItem.changeValueTo({
      hello: 'there'
    });

    // test to see if both values are the same
    expect(oldObj1).toBe(imo.read().items.ref[0].ref.sibling);

    // test to see if the changed item has really changed
    expect(imo.read().items.ref[0].ref.bla.ref.items.ref[0].ref).
        not.toBe(old3);
    expect(deepItem.read()).not.toBe(old3);

    // test to see if the parent has changed
    expect(imo.read().items.ref).not.toBe(oldObj2);

    // test to see if the referenced items are the same
    expect(deepItem.read()).toBe(otherAreaItem.item.read());

    // test to see if the other parent has changed
    expect(imo.wrapped().otherArea.read()).not.toBe(old4);

    // test to see if the other area has not changed
    expect(imo.wrapped().andAnother.read()).toBe(old5);

    // make sure the parents of the other item has changed correctly
    expect(deepItem.__private.parents.length).toBe(2);

    // make sure the parents of the referenced item has changed correctly
    expect(otherAreaItem.item.__private.parents.length).toBe(2);

    var x2 = {
      rar: 'bla'
    };
    otherAreaItem.item.changeReferenceTo(x2);

    // ensure the referenced items are not the same anymore
    expect(deepItem.read()).not.toBe(otherAreaItem.item.read());

    // make sure the parents of the other item has changed correctly
    expect(deepItem.__private.parents.length).toBe(1);

    // make sure the parents of the referenced item has changed correctly
    expect(otherAreaItem.item.__private.parents.length).toBe(1);
  });

  it('should replace an object within an Immutable array if the id\'s are the same', function() {
    var exampleData = [
      {
        foo: [
          {
            id: 1,
            bla: 'test'
          }
        ]
      }
    ];
    var array = ImmutableGraphRegistry.getImmutableObject(exampleData);
    var newObj = {
      id: 1,
      bla: 'test2'
    };
    var old1 = array.read();

    array.wrapped()[0].wrapped().foo.insert(newObj);

    expect(array.wrapped()[0].wrapped().foo.read().length).toBe(1);
    expect(array.wrapped()[0].wrapped().foo.wrapped()[0].read()).toBe(newObj);
    expect(array.read()).not.toBe(old1);

    var newMultiple = [
      {
        id: 1,
        bla: 'zzz'
      },
      {
        id: 2,
        bla: 'yyy'
      }
    ];
    array.wrapped()[0].wrapped().foo.insertMulti(newMultiple);
    expect(array.wrapped()[0].wrapped().foo.read().length).toBe(2);
  });

  it('should support saving and restoring versions of the graph', function() {
    var exampleData = {
      parent: {
        items: [
          {
            id: 1,
            title: 'test'
          }
        ]
      },
      otherOne: {
        child: {}
      }
    };
    var imo = ImmutableGraphRegistry.getImmutableObject(exampleData);
    var ref = imo.wrapped().parent.wrapped().items.at(0).read();
    imo.wrapped().otherOne.wrapped().child.changeReferenceTo(ref);
    imo.enableVersioning();
    imo.saveVersion('Initial');
    var newData = {id: 1, title: 'test444'};
    imo.wrapped().parent.wrapped().items.at(0).changeValueTo(newData);
    expect(imo.wrapped().otherOne.wrapped().child.read()).toBe(
        imo.wrapped().parent.wrapped().items.at(0).read());
    expect(imo.wrapped().otherOne.wrapped().child.read()).toBe(
      newData);
    imo.restoreVersion(imo.getVersions()[0]);
    expect(imo.wrapped().otherOne.wrapped().child.read()).toEqual({
      id: 1,
      title: 'test'
    });
    expect(imo.wrapped().otherOne.wrapped().child.read()).toBe(
      imo.wrapped().parent.wrapped().items.at(0).read());
  });

  it('should support restoring versions of the graph', function() {

  });

  // test for possible leaks -> not properly removing objects

});
