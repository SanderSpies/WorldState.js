WorldState.js - a generator for immutable graphs
===

Current version: pre 0.1

DO NOT USE. Still getting everything ready for 0.1.

Introduction
---
This generator takes a plain object model and turns it into an immutable graph. Although it's possible to only
use the library, I would recommend using the generator for creating wrappers around the library. This way the
cognitive strain of using this library is left to a minimum.

Library features:
- Immutable
- High performance
- Recreating parent objects
- Change by value

  To change all the objects pointing at the same object at once
- Change by reference

  To change only the current object
- Versioning support

  Easily jump to different versions the graph. This is handy for undo/redo support.
- Object pools (not ready yet)
- Diff/merge support (not ready yet)
- Closure Compiler Advanced Mode compatible (not ready yet)

Added features by generated wrappers:
- Easy to use
- JsDocs based on Closure

[Ideas behind the graph](GRAPH.md)

Installation
---
npm install -g worldstate

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
var TodoGraph = require('outputdir/TodoGraph');
```

Loading data into the graph (you might want to use [superagent](https://github.com/visionmedia/superagent)):
```
var todoGraph = new TodoGraph({/*data*/});
```

Getting the first item of an array:
```
console.log('The first item is:', todoGraph.items().at(0).read());
```

Finding an item:
```
console.log('Found item:', todoGraph.items().where({id:2})[0].read());
```

Inserting an item:
```
var todoItem = TodoGraph.newItem({
   id: 3,
   title: 'foo',
   isComplete: true
});
todoGraph.items().insert(todoItem);
```

If a new item is inserted with an id parameter that is already present, it will replace the old item.

You can also insert multiple values by using ``insertMulti``.

Setting the object pool:
```
//Not implemented yet
TodoGraph.setItemsPool(1000);
```

Using a pooled object:
```
// Not implemented yet
var pooledItem = TodoGraph.newPooledItem();
var data = pooledItem.read();
data.id = 1;
data.title = 'bar';
todoGraph.items().insert(pooledItem);
```

Changing a value:
```
todoGraph.items().at(0).changeValueTo({
    id: 3,
    title: 'bla',
    isComplete: true
});
```

Changing a reference:
```
todoGraph.items().at(0).changeReferenceTo({
    id: 3,
    title: 'bla',
    isComplete: true
});
```

Saving and restoring a version:
```
todoGraph.enableVersioning();
todoGraph.saveVersion('Initial version');
todoGraph.items().at(0).changeValueTo({
    id: 3,
    title: 'bla',
    isComplete: true
});
var versions = todoGraph.getVersions();
todoGraph.restoreVersion(versions[0]);
```

Removing a part of the graph:
```
//Not implemented yet
todoGraph.items().at(1).remove();
```

Get the difference between two graphs:
```
// Not implemented yet
var diff = todoGraph.diff(otherTodoGraph)
```

Merging two graphs
```
// Not implemented yet
var mergedGraph = todoGraph.merge(otherTodoGraph);
```

[More examples](EXAMPLES.md)

FAQ
---
- Why no support for feature XYZ?

  Feel free to report an issue if you are missing a feature.

LICENSE
---
MIT