#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');

var Parser = require('./Parser');

var Generator = {

  run: function() {
    var inputFolder = process.argv[2];
    var outputFolder = process.argv[3];

    console.info('Processing files from:', inputFolder);

    Parser.parse(inputFolder, outputFolder);

    console.info('Created graph inside:', outputFolder);
  }
};

Generator.run();

module.exports = Generator;
