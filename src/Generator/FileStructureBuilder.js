'use strict';

var TemplateConstants = require('./TemplateConstants');

var isArray = Array.isArray;

var ObjectFunctionTemplates = [
  TemplateConstants.CHANGE_REFERENCE_TO_FUNCTION,
  TemplateConstants.CHANGE_VALUE_TO_FUNCTION,
  TemplateConstants.ENABLE_VERSIONING_FUNCTION,
  TemplateConstants.GET_VERSIONS_FUNCTION,
  TemplateConstants.READ_FUNCTION,
  TemplateConstants.RESTORE_VERSION_FUNCTION,
  TemplateConstants.SAVE_VERSION_FUNCTION,
  TemplateConstants.AFTER_CHANGE_FUNCTION
];

var ArrayFunctionTemplates = ObjectFunctionTemplates.concat([
  TemplateConstants.AT_FUNCTION,
  TemplateConstants.INSERT_FUNCTION,
  TemplateConstants.INSERT_MULTI_FUNCTION,
  TemplateConstants.WHERE_FUNCTION
]);

var FileStructureBuilder = {

  createFunction: function(template, info) {
    for (var key in info) {
      if (info.hasOwnProperty(key)) {
        template = template.replace(new RegExp('{' + key + '}', 'g'),
            info[key]);
      }
    }
    return template;
  },

  getType: function(val) {
    if (Array.isArray(val)) {
      return 'Array';
    }
    else {
      return typeof val;
    }
  },

  getObjectInfo: function(objName, obj) {
    var GraphReadDoc = '';
    var GraphChangeValueDoc = '';
    var child = obj;
    if (isArray(obj)) {
      child = obj[0];
    }

    for (var key in child) {
      if (child.hasOwnProperty(key)) {
        var val = child[key];
        GraphChangeValueDoc += key + ':' +
            FileStructureBuilder.getType(val) + ',';
        if (typeof val !== 'object') {
          GraphReadDoc += key + ':' +
              FileStructureBuilder.getType(val) + ',';
        }
      }
    }

    GraphChangeValueDoc = GraphChangeValueDoc.length ? GraphChangeValueDoc.
        substr(0, GraphChangeValueDoc.length - 1) : GraphChangeValueDoc;
    if (isArray) {
      GraphChangeValueDoc = '[{' + GraphChangeValueDoc + '}]';
    }
    else {
      GraphChangeValueDoc = '{' + GraphChangeValueDoc + '}';
    }

    GraphReadDoc = GraphReadDoc.length ? GraphReadDoc.
        substr(0, GraphReadDoc.length - 1) : GraphReadDoc;
    GraphReadDoc = '{' + GraphReadDoc + '}';

    var GraphInsertDoc = objName.substr(0, objName.length - 1) + 'Prototype';

    return {
      GraphName: objName,
      SubGraphName: objName.substr(0, objName.length - 1),
      graphName: objName[0].toUpperCase() + objName.substr(1),
      GraphChangeValueDoc: GraphChangeValueDoc,
      GraphReadDoc: GraphReadDoc,
      GraphInsertDoc: GraphInsertDoc
    };
  },

  getWrappersToChildObjectsFunctions: function(obj, info) {
    var functions = [];
    for (var key in obj) {
      var val = obj[key];
      if (typeof val === 'object') {
        if (isNaN(key)) {
          info.subGraphName = key;
          info.SubGraphName = key[0].toUpperCase() + key.substr(1);

          functions[functions.length] = FileStructureBuilder.
              createFunction(TemplateConstants.__SUB_GRAPH_WRAPPER__, info);
        }
      }
    }
    return functions;
  },

  getRequireStatements: function(obj) {
    var requires = [];
    for (var key in obj) {
      var val = obj[key];
      if (typeof val === 'object') {
        if (isNaN(key)) {
          var SubGraphName = key[0].toUpperCase() + key.substr(1);
          requires[requires.length] = FileStructureBuilder
            .createFunction(TemplateConstants.__SUB_GRAPH_REQUIRE__,
              {SubGraphName: SubGraphName});
        }
      }
    }
    return requires;
  },

  createObjectFileStructure: function(objName, obj) {
    var fileStructure = {
      fileName: objName + '.js',
      functions: [],
      require: [],
      type: isArray(obj) ? 'Array' : 'object',
      graphChangeValueDoc: ''
    };

    var info = FileStructureBuilder.getObjectInfo(objName.split('.')[0], obj);

    // add standard functions
    var functions = [];
    var functionTemplates = isArray(obj) ? ArrayFunctionTemplates :
        ObjectFunctionTemplates;
    for (var i = 0, l = functionTemplates.length; i < l; i++) {
      functions[i] = FileStructureBuilder.
          createFunction(functionTemplates[i], info);
    }

    // add custom functions
    var customFunctions = FileStructureBuilder.
        getWrappersToChildObjectsFunctions(obj, info);

    var requireStatements = FileStructureBuilder.
        getRequireStatements(obj);

    if (isArray(obj)) {
      requireStatements = requireStatements.concat(
          [FileStructureBuilder.createFunction(TemplateConstants.__SUB_GRAPH_REQUIRE__, {SubGraphName: info.SubGraphName})]
        );
    }

    fileStructure.functions = functions.concat(customFunctions);
    fileStructure.require = requireStatements;
    fileStructure.graphChangeValueDoc = info.GraphChangeValueDoc;

    return fileStructure;
  },

  createFileStructure: function(fileName, obj) {
    return FileStructureBuilder.createObjectFileStructure(fileName, obj);
  },

  getSubFiles: function(objName, obj) {
    var sub = [];
    for (var key in obj) {
      var val = obj[key];
      if (typeof val === 'object') {
        if (isNaN(key)) {
          var SubGraphName = key[0].toUpperCase() + key.substr(1);

          sub[sub.length] = {
            fileName: SubGraphName,
            obj: val
          };
        }
        else {
          var SubGraphName = objName.substr(0, objName.length - 1);
          sub[sub.length] = {
            fileName: SubGraphName,
            obj: val
          };
        }
      }
    }
    return sub;
  },

  createFileStructures: function(parsedObjects) {
    var fileStructures = [];
    for (var i = 0, l = parsedObjects.length; i < l; i++) {
      var parseObject = parsedObjects[i];
      var newFileStructure = FileStructureBuilder.
          createFileStructure(parseObject.fileName, parseObject.obj);
      fileStructures[fileStructures.length] = newFileStructure;
      var subFiles = FileStructureBuilder.getSubFiles(parseObject.fileName.split('.')[0], parseObject.obj);
      if (subFiles.length) {
        fileStructures = fileStructures.concat(
            FileStructureBuilder.createFileStructures(subFiles));
      }
    }
    return fileStructures;
  }
};

module.exports = FileStructureBuilder;
