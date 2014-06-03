'use strict';

var CommandKeys = require('./CommandKeys');
var CommandRegistry = require('./CommandRegistry');


/**
 * @type {ItemsPrototype}
 */
var items = require('../Graph/TodoList').items();

/**
 * Update a todo item
 */
var UpdateTodoItemCommand = {

  /**
   * @param {{text:string, isComplete:boolean, id:number}} opt
   */
  execute: function(opt) {
    var id = opt.id;

    var todoListItem = {
      text: opt.text,
      isComplete: opt.isComplete
    };

    var oldItem = items.where({__worldStateUniqueId: id})[0];
    var oldText = oldItem.read().text;
    var oldIsComplete = oldItem.read().isComplete;
    oldItem.changeValueTo(todoListItem);
    items.saveVersion('Changed todo item from ' + oldText + ' ' +
        (oldIsComplete? 'checked' : 'unchecked') +
        ' to ' + opt.text + ' ' + (opt.isComplete? 'checked' : 'unchecked'));
  }
};

CommandRegistry.registerCommand(CommandKeys.UpdateTodoItem, UpdateTodoItemCommand);
