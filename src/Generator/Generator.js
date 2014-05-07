#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

var inputFolder = process.argv[2];
var outputFolder = process.argv[3];

var ImmutableObjectTemplate = fs.readFileSync(path.resolve('src/Generator/Templates/ImmutableObjectTemplate.jst'), {
  encoding:'utf8'
});

var ImmutableArrayTemplate = fs.readFileSync(path.resolve('src/Generator/Templates/ImmutableArrayTemplate.jst'), {
  encoding:'utf8'
});

function parseJSONFiles(inputFolder, files) {
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
      console.log('Invalid JSON file:', file)
    }
  }
  return parsedObjects;
}

function generateObjectWrapper(outputFolder, objName, obj) {
  var insertObjectFields = [];
  var insertArrayFields = [];
  var x = Array.isArray(obj) ? ImmutableArrayTemplate.replace(/{GraphName}/gi, objName) :
    ImmutableObjectTemplate.replace(/{GraphName}/gi, objName);
  var requireBlock = '';
  var generatedCode = '';
  var graphReadDoc = '{';
  var graphValueDoc = '{';
  var graphInsertDoc = '';
  for (var key in obj) {
    var val = obj[key];
    var constructorName;

    if (Array.isArray(obj)){
      constructorName = objName.substr(0, objName.length - 1);
      val = obj[0];
      if (typeof val === 'object') {
        graphInsertDoc += '{' + constructorName + '}';
        generateObjectWrapper(outputFolder, constructorName, val)
      }
    }
    else if (typeof val === 'object') {
      constructorName = objName + key[0].toUpperCase() + key.substr(1);
      generatedCode += '  /**\n';
      generatedCode += '   * @returns {' + constructorName +'}\n';
      generatedCode += '   */\n';
      generatedCode += '  ' + key + ': function ' + objName + '$' + key + '() {\n' +
        '    var wrappers = this.__private.wrappers;\n' +
        '    if (!wrappers.' + key + ') {\n' +
        '      wrappers.' + key + ' = new ' + constructorName + '(this.__private.graph.__private.refToObj.ref.' + key + '.ref);\n' +
        '    }\n' +
        '    return wrappers.' + key + ';\n' +
        '  },\n\n';
      requireBlock += 'var ' + constructorName + ' = require(\'./' + constructorName + '\');\n';
      if (Array.isArray(val)) {
        generateArrayWrapper(outputFolder, constructorName, val);
      }
      else {
        generateObjectWrapper(outputFolder, constructorName, val);
      }
    }
    else {
      graphReadDoc += key + ':' + typeof(val) + ',';
    }
    graphValueDoc += key + ':' + typeof(val) + ',';

  }
  graphReadDoc = graphReadDoc.substr(0, graphReadDoc.length - 1) + '}';
  graphValueDoc = graphValueDoc.substr(0, graphValueDoc.length - 1) + '}';
  x = x.replace(/{RequireBlock}/gi, requireBlock);
  x = x.replace(/{GraphMethods}/gi, generatedCode);
  x = x.replace(/{GraphReadDoc}/gi, graphReadDoc);
  x = x.replace(/{GraphChangeValueDoc}/gi, graphValueDoc);
  x = x.replace(/{GraphInsertDoc}/gi, graphInsertDoc);

  fs.writeFile(outputFolder + '/' + objName + '.js', x,  function(err) {
    if (err) {
      console.log('Writing the file went probably wrong - make sure you have write access.');
      console.log(err);
    }
  });
}

function generateArrayWrapper(outputFolder, graphName, obj) {
  generateObjectWrapper(outputFolder, graphName, obj);
}

function generateWrapper(outputFolder, graphName, obj) {
  if (Array.isArray(obj)) {
    generateArrayWrapper(outputFolder,graphName, obj)
  }
  else {
    generateObjectWrapper(outputFolder,graphName, obj)
  }
}

fs.readdir(inputFolder, function (err, files) {
  if (err) {
    console.log('The input folder is probably incorrect');
    return;
  }

  var parsedFiles = parseJSONFiles(inputFolder, files);
  for (var i = 0, l = parsedFiles.length; i < l; i++) {
    var parsedInfo = parsedFiles[i];
    generateWrapper(outputFolder, parsedInfo.fileName.split('.')[0], parsedInfo.obj);
  }
});