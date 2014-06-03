'use strict';

var CommandKeys = require('./CommandKeys');
var CommandRegistry = require('./CommandRegistry');

/**
 *
 */
var RedoCommand = {

  execute: function() {

  }

};

CommandRegistry.registerCommand(CommandKeys.Redo, RedoCommand);
