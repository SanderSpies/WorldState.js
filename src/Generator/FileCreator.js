'use strict';

var fs = require('fs');
var FileStructureBuilder = require('./FileStructureBuilder');
var TemplateConstants = require('./TemplateConstants');

var FileCreator = {
  createFiles: function(outputFolder, fileStructures) {
    for (var i = 0, l = fileStructures.length; i < l; i++) {
      var fileStructure = fileStructures[i];

      var file = fileStructure.type === 'object' ?
          TemplateConstants.IMMUTABLE_GRAPH_OBJECT_TEMPLATE :
          TemplateConstants.IMMUTABLE_GRAPH_ARRAY_TEMPLATE;
      file = file.replace(/{RequireBlock}/g,
          fileStructure.require.join('\n'));
      file = file.replace(/{GraphName}/g,
          fileStructure.fileName.split('.')[0]);
      file = file.replace(/{SubFunctions}/g,
          fileStructure.functions.join(',\n\n'));
      file = file.replace(/{GraphChangeValueDoc}/g,
          fileStructure.graphChangeValueDoc);

      fs.writeFile(outputFolder + '/' + fileStructure.fileName.split('.')[0] + '.js', file, function(err) {
        if (err) {
          console.log('Writing the file went probably wrong - make sure you have write access.');
          console.log(err);
        }
      });

    }
  }
};

module.exports = FileCreator;
