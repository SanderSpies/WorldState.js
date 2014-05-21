'use strict';

var fs = require('fs');
var path = require('path');
var FileCreator = require('./FileCreator');
var FileStructureBuilder = require('./FileStructureBuilder');

var isArray = Array.isArray;

var Parser = {

  parseFolder: function(inputFolder) {
    var files = fs.readdirSync(inputFolder);
    var parsedObjects = [];
    for (var i = 0, l = files.length; i < l; i++) {
      var file = files[i];
      try {
        var fullFilePath = process.cwd() + '/' + inputFolder + '/' + file;
        parsedObjects[parsedObjects.length] = {
          fileName: path.basename(fullFilePath),
          obj: require(fullFilePath)
        };
      }
      catch (e) {
        console.log('Invalid JSON file:', file);
      }
    }
    return parsedObjects;
  },

  parse: function(inputFolder, outputFolder) {
    var parsedObjects = Parser.parseFolder(inputFolder);
    var fileStructures = FileStructureBuilder.createFileStructures(parsedObjects);
    FileCreator.createFiles(outputFolder, fileStructures);
  }
};

module.exports = Parser;
