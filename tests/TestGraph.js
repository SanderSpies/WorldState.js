'use strict';

var ImmutableGraphObject = require('../src/Base/ImmutableGraphObject');
var ImmutableGraphArray = require('../src/Base/ImmutableGraphArray');

describe('WorldState.js', function() {

  it('should have the correct values', function() {

    // test 1
    var testData = {
      text: 'oh hai'
    };
    var imo1 = new ImmutableGraphObject(testData);
    expect(imo1.read().text).toBe('oh hai');

    var testData2 = {
      foo: [
        {
          id: 1,
          bar: 'woop woop'
        }
      ]
    };

    // test 2
    var imo2 = new ImmutableGraphObject(testData2);
    var imo3 = imo2.wrapped().foo;
    expect(imo3.wrapped()[0].read()).toBe(imo2.__private.refToObj.ref.foo.ref[0].ref);

    // test 3
    imo3.changeValueTo({
      bla: {
        x: '33'
      }
    });
    expect(imo3.wrapped().bla.read()).toBe(imo2.wrapped().foo.wrapped().bla.read());
  });

  it('should recreate parent objects, but not siblings', function() {
    var testData = {
      items: [
        {
          bla: {
            items: [
              {
                hello: 'world'
              }
            ]
          }, sibling: {
            foo: 'bar'
          }
        }
      ]
    };
    var imo = new ImmutableGraphObject(testData);
    var deepItem = imo.wrapped().items.wrapped()[0].wrapped().bla.wrapped().items.wrapped()[0];
    var oldObj1 = imo.read().items.ref[0].ref.sibling;
    var oldObj2 = imo.read().items.ref;
    var old3 = deepItem.__private.refToObj.ref;
    deepItem.changeValueTo({
      hello: 'there'
    });

    expect(oldObj1).toBe(imo.read().items.ref[0].ref.sibling);
    expect(imo.read().items.ref[0].ref.bla.ref.items.ref[0].ref).
      not.toBe(old3);
    expect(deepItem.read()).not.toBe(old3);
    expect(imo.read().items.ref).not.toBe(oldObj2);
  });

  it('should replace an object within an Immutable array if the id\'s are the same', function() {

  });

  it('should support saving versions of the graph', function() {

  });

  it('should support restoring versions of the graph', function() {

  });

  // test for possible leaks -> not properly removing objects

});
