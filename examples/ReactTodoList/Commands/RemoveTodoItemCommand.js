'use strict';

var CommandKeys = require('./CommandKeys');
var CommandRegistry = require('./CommandRegistry');


/**
 * @type {ItemsPrototype}
 */
var items = require('../Graph/TodoList').items();

/**
 * Remove a todo item
 */
var RemoveTodoItemCommand = {

  /**
   * @param {{id:number}} opt
   */
  execute: function(opt) {
    var id = opt.id;
    var item = items.where({__worldStateUniqueId: id})[0];
    var text = item.read().text;
    item.remove();
    items.saveVersion('Removed todo item ' + text);
  }
};

CommandRegistry.registerCommand(CommandKeys.RemoveTodoItem, RemoveTodoItemCommand);
