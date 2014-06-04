'use strict';

var CommandKeys = require('./CommandKeys');
var CommandRegistry = require('./CommandRegistry');


/**
 * @type {ItemsPrototype}
 */
var graph = require('../Graph/Graph').graph;

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
    var text = opt.text;
    if (!text || text.trim() === '') {
      return;
    }
    var todoListItem = {
      text: opt.text,
      isComplete: false
    };
    graph.items().insert(Item.newInstance(todoListItem));
    graph.items().saveVersion('Added todo item ' + opt.text);
  }
};

CommandRegistry.registerCommand(CommandKeys.AddTodoItem, AddTodoItemCommand);
