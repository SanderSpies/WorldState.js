WorldState.js - a library for immutable graphs
===

Current version: pre 0.1

Introduction
---
This library takes a plain object model and turns it into an immutable object model. Although it's possible to only
use the library, I would recommend using the code generator for generating wrappers around the library. This way the
cognitive strain of using this library is left to a minimum.

Library features:
- Immutable
- High performance
- Recreating parent objects
- Change by value - To change all the objects pointing at the same object at once
- Change by reference - To change only the current object
- Versioning support - Easily jump to different versions the graph

Added features by generated wrappers:
- Easy to use
- JSDocs (closure style) are automatically created for the wrappers

Todo:
- Object pools support
- More complex examples:
  - Separation between global and local graph objects.
  - Infinite scrolling
- Merge/diff support

[More details](GRAPH.md)

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

Next you need to generate the immutable wrappers:
```
worldstate inputdir outputdir
```

Now you can use the immutable graph within your application:
```
var TodoGraph = require('outputdir/TodoGraph');
```

Loading data into the graph:
```
var todoGraph = new TodoGraph({/*data*/});
```

Getting the first item of an array:
```
console.log('The first item is:', todoGraph.items().at(0).read());
```

Finding an item in an array:
```
console.log('Found item:', todoGraph.items().where({id:2})[0].read());
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

[More examples](EXAMPLES.md)

LICENSE
---
MIT