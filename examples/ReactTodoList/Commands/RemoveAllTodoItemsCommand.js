'use strict';

var CommandKeys = require('./CommandKeys');
var CommandRegistry = require('./CommandRegistry');


/**
 * @type {ItemsPrototype}
 */
var items = require('../Graph/TodoList').items();

/**
 * Remove all todo items
 */
var RemoveAllTodoItemsCommand = {

  /**
   */
  execute: function() {
    items.remove();
    items.saveVersion('Removed all todo items');
  }
};

CommandRegistry.registerCommand(CommandKeys.RemoveAllTodoItems, RemoveAllTodoItemsCommand);
