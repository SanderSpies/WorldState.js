'use strict';

var commands = {};

var CommandRegistry = {

  registerCommand: function(commandKey, command) {
    commands[commandKey] = command;
  },

  executeCommand: function(commandKey, options) {
    var command = commands[commandKey];
    command.execute(options);
  }

};

module.exports = CommandRegistry;
