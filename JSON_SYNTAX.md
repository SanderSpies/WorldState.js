JSON Syntax
===
The intention is to use JSON as much as possible, however within a complex graph you might have multiple things pointing
to the same object, unfortunately JSON doesn't support this. Therefore we've added several options on top of JSON:
- "{item of /foo/bar}" -> create an object of the given type
- "{array of /foo/bar}" -> creates an array of the given type
