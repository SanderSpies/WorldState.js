WorldState.js - a generator for immutable graphs
===
[![Build Status](https://travis-ci.org/SanderSpies/WorldState.js.svg?branch=master)](https://travis-ci.org/SanderSpies/WorldState.js)

Current version: pre 0.1

DO NOT USE. Still getting everything ready for 0.1. The library + wrapper features seem to be working for 0.1,
however the ReactWorldStateMixin still need extra work before I will call it a 0.1.

Introduction
---
This generator turns a JSON object model into an immutable graph.

Although it's possible to only use the library, I would recommend using the generator for creating wrappers around
the library. This way the cognitive strain of using this library is left to a minimum.

Library features:
- Immutable
- High performance (verification needed)
- Recursive
- Recreating parent objects
- Change by value

  To change all the objects pointing at the same object at once
- Change by reference

  To change only the current object
- Versioning support

  Easily jump to different versions the graph. This is handy for undo/redo support.
- ReactWorldStateMixin to make implementing WorldState.js with React easy (not ready yet)

[See Jasmine tests for examples](tests/BaseTests.js)

Added features by generated wrappers:
- Easy to use
- JsDocs based on Closure

Coming after 0.1:
- Jasmine tests for wrappers
- Solve expected memory leak issues
- Object pools
- Diff/merge support
- Closure Compiler Advanced Mode compatible
- Branches
- Grunt + Gulp support

[Ideas behind the graph](GRAPH.md)

Installation
---
First install WorldState.js globally:
```
npm install -g worldstate
```

Then add it to your project's package.json:
```
{
    "dependencies": {
        "worldstate": "~0.1"
    }
}
```
Note: as I'm still getting everything ready for 0.1, the 0.1 release is not on NPM yet.

Getting started
---
First you need to create a JSON representation of the model. For example:

File: TodoGraph.json
```
{
    "title": "an example",
    "items": [
        {
            id: 1,
            title: "example",
            isComplete: false
        },
        {
            id: 2,
            title: "bla 2",
            isComplete: false
        }
    ]
}
```
[Extra syntax options](JSON_SYNTAX.md)

Next you need to generate the immutable wrappers:
```
worldstate inputdir outputdir
```

Now you can use the immutable graph within your application:
```
/**
 * @type {TodoGraph}
 */
var TodoGraph = require('outputdir/TodoGraph');
```

The {TodoGraph} annotation is added for autocomplete support.

Loading data into the graph (you might want to use [superagent](https://github.com/visionmedia/superagent)):
```
var todoGraph = TodoGraph.newInstance({/*data*/});
```

Getting the first item of an array:
```
console.log('The first item is:', todoGraph.items().at(0).read());
```
If you have performed an action like ``insert``, ``insertMulti``, ``changeValueTo`` or ``changeReferenceTo``, you must
wait until the action has completed:

```
// perform action like insert, insertMulti, changeValueTo or changeReferenceTo
todoGraph.afterChange(function() {
    // changes are complete
});
```

Finding an item:
```
console.log('Found item:', todoGraph.items().where({id:2})[0].read());
```

Inserting a value:
```
var todoItem = TodoGraphItem.newInstance({
   id: 3,
   title: 'foo',
   isComplete: true
});
todoGraph.items().insert(todoItem);
```

If a new item is inserted with an id parameter that is already present, it will replace the old item.

You can also insert multiple values by using ``insertMulti``, which accepts an array.

Changing a value:
```
todoGraph.items().at(0).changeValueTo({
    id: 3,
    title: 'bla',
    isComplete: true
});
```
All the objects using this reference will get this value.

Changing a reference:
```
todoGraph.items().at(0).changeReferenceTo({
    id: 3,
    title: 'bla',
    isComplete: true
});
```
You can point to an existing reference if you want to use the same values.

Saving and restoring a version:
```
todoGraph.enableVersioning();
todoGraph.saveVersion('Initial version');
todoGraph.items().at(0).changeValueTo({
    id: 3,
    title: 'bla',
    isComplete: true
});
todoGraph.afterChange(function(){
    var versions = todoGraph.getVersions();
    todoGraph.restoreVersion(versions[0]);
});
```

Removing a part of the graph:
```
todoGraph.items().at(1).remove();
```

[More examples](EXAMPLES.md)

FAQ
---
- Why no support for feature XYZ?

  Feel free to open an issue for the feature that you are missing.

- Which browsers are supported?

  IE8+, latest Chrome, Firefox, Safari, Opera.

LICENSE
---
MIT