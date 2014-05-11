#!/usr/bin/env node

// Yes this code is fugly -> needs MAJOR refactoring.

var fs = require('fs');
var path = require('path');

var inputFolder = process.argv[2];
var outputFolder = process.argv[3];

if (!inputFolder || !outputFolder) {
  console.log('Correct usage: worldstate inputfolder outputfolder');
  return;
}

var ImmutableObjectTemplate = fs.readFileSync(__dirname + '/Templates/ImmutableObjectTemplate.jst',{
  encoding:'utf8'
});

var ImmutableArrayTemplate = fs.readFileSync(__dirname + '/Templates/ImmutableArrayTemplate.jst',{
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
      console.log('Invalid JSON file:', file);
    }
  }
  return parsedObjects;
}

function createWrapperFunction(objName, val) {

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
    if (val == null) {
      continue;
    }
    var constructorName;

    if (Array.isArray(obj)){
      constructorName = getSingleName(objName);

      val = obj[0];
      if (typeof val === 'object') {
        graphInsertDoc += '{' + constructorName + 'Prototype}';
        generateObjectWrapper(outputFolder, constructorName, val)
      }
    }
    else if (typeof val === 'object') {
      constructorName = objName + key[0].toUpperCase() + key.substr(1);
      generatedCode += '  /**\n';
      generatedCode += '   * @this {' + objName +'}\n';
      generatedCode += '   * @return {' + constructorName +'}\n';
      generatedCode += '   */\n';
      generatedCode += '  ' + key + ': function ' + objName + '$' + key + '() {\n' +
        '    var __private = this.__private;\n' +
        '    var __graphPrivate = __private.graph.__private;\n' +
        '    var ' + key + ' = __graphPrivate.refToObj.ref.' + key + '.ref;\n' +
        '    var wrappers = __private.wrappers;\n' +
        '    if (!wrappers.' + key + ') {\n' +
        '      wrappers.' + key + ' = new ' + constructorName + '(' + key + ');\n' +
        '    }\n' +
        '    return wrappers.' + key + ';\n' +
        '  },\n\n';
      requireBlock += '/* @type {' + constructorName +'} */\n';
      requireBlock += 'var ' + constructorName + ' = require(\'./' + constructorName + '\');\n';
      if (Array.isArray(val)) {
        generateArrayWrapper(outputFolder, constructorName, val);
      }
      else {
        generateObjectWrapper(outputFolder, constructorName, val);
      }
    }
    else if (typeof val === 'string' && val.match(/^\{array of ([\/a-zA-Z0-9]*)\}$/gi)) {
      console.log('do array magic');
    }
    else if (typeof val === 'string' && val.match(/^\{item of ([\/a-zA-Z0-9]*)\}$/gi)) {
      console.log('do item magic');
    }
    else if (typeof val === 'string' && val.match(/^\{enum of ([\/a-zA-Z0-9]*)\}$/gi)) {
      console.log('do item magic');
    }
    else {
      graphReadDoc += key + ':' + getType(val) + ',';
    }

    graphValueDoc +=  key + ':' + getType(val) + ',';
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

function getType(val) {
  if (Array.isArray(val)) {
    return 'Array';
  }
  else {
    return typeof val;
  }
}

function getSingleName(val) {
  if (val.indexOf('ies') === (val.length - 3)) {
    val = val.substr(0, val.length - 3) + 'y';
  }
  else if (val.lastIndexOf('s') === (val.length - 1)) {

    val = val.substr(0, val.length - 1);
  }

  return val;
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