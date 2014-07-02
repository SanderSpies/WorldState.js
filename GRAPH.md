Idea's behind the graph
===

Fast comparison
---
The fastest way to see if an object has changed is by using strict equals. Strict equals checks if two objects refer
to the same memory address. Unfortunately JavaScript objects are mutable, which means that changing an object
does not change its memory address. Therefore most developers compare properties one by one to see if an object
has changed. It the developer wants to take advantage of the speed that strict equals offers, the developer
needs to create a new object with the changed and unchanged properties. The developer can then do a comparison between
the old and new object to see if something has changed. So objects should be treated like if they were immutable.

The drawback here is creating a new object and the memory allocation, luckily browsers are really good at this. When
you are changing a lot of objects at once, in for instance a game, you might want to use an object pool.

Changing multiple references to the same object at once
---
If you change a property value, it doesn't change all the other properties referring the same value. To do this
you need an object in between that is referred to by all properties. I call this a reference object, and it holds
the actual object. If you change this value, every referring property will have the new value through the reference object.

The drawback here is the extra reference object that is needed.

Recreate parent
---
If you want to check if an object has changed, it would be awkward to check every child objects for changes.
Therefore the parents should also be recreated every time something changes.

The drawback here is also creating new objects and memory allocation.

Aggregating child changes
---
If we would blindly change 1000 children of the same item, it would result in 1000x recreation of the same path. To
avoid this we aggregate all child changes and perform them all at once. This gives a small performance loss for simple
operations, but gives a big performance boost for when performing lots of changes. We could probably tweak this more
in the future for even better results.

History / Undo / Redo
---
In the previous sections we spoke about replacing objects with new objects, whereby the old object chains are
cleaned up by the garbage collector. If we want to support history we need to save this chain of old objects,
and be able to restore them. This should make jumping to different versions of the chains of objects very fast.

Edges
---
A graph (database) distinguish itself by describing more elaborate relationships between objects, and giving the
capability to search for these relationships. I believe these relationships should exist besides the "normal" object
model, which is just objects referring to other objects - basically a "has" relationship. It should be possible to
search for object properties and relationships between objects.

These elaborate relationships should be described by edge objects that have pointers to the two objects
involved in the relationship, and a pointer to the edgetype object, also a separate object. The edge object
should also be able contain details regarding the relationship.