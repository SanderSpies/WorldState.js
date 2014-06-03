WorldState.js - pre 0.1 - a generator for immutable graphs
===
[![Build Status](https://travis-ci.org/SanderSpies/WorldState.js.svg?branch=master)](https://travis-ci.org/SanderSpies/WorldState.js)

Current version: pre 0.1

DO NOT USE. Still need to get ReactWorldStateMixin working properly and give proof with a simple Todo example.

Introduction
---
This generator turns a JSON object model into an immutable graph.

Features for 0.1
---
- Immutable
- High performance
- Straight forward usage
- Generated JsDocs for great auto-complete support
- Support for complex structures
- Recreating parent objects
- Change by value or reference
- Versioning support
- ReactWorldStateMixin to make implementing WorldState.js with React easy (not ready yet)
- Warning: stuff might not work completely as advertised - if you come across anything, please file an issue

Although it's possible to only use the library, I would recommend using the generator for creating wrappers around
the library. This way the cognitive strain of using this library is left to a minimum.

[See Jasmine tests for library / non-wrapper examples](tests/BaseTests.js)
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
var somewhereElseInTheGraph = todoGraph.items.at(0);
todoGraph.items().at(1).changeReferenceTo(somewhereElseInTheGraph.read());
```
Now both items will be changed at the same the time when using changeValueTo :-).

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

LICENSE
---
MIT