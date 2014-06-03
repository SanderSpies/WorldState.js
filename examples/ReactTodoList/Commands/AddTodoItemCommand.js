'use strict';

var CommandKeys = require('./CommandKeys');
var CommandRegistry = require('./CommandRegistry');


/**
 * @type {ItemsPrototype}
 */
var items = require('../Graph/TodoList').items();

/**
 * @type {Item}
 */
var Item = require('../Graph/Item');
/**
 * Add a todo item
 */
var AddTodoItemCommand = {

  /**
   * @param {{text:string}} opt
   */
  execute: function(opt) {
    var todoListItem = {
      text: opt.text,
      isComplete: false
    };
    items.insert(Item.newInstance(todoListItem));
    items.saveVersion('Added todo item ' + opt.text);
  }
};

CommandRegistry.registerCommand(CommandKeys.AddTodoItem, AddTodoItemCommand);
