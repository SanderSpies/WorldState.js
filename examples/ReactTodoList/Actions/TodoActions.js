'use strict';

var clone = require('worldstate/src/Base/clone');


/**
 * @type {TodoListPrototype}
 */
var todoListGraph = require('../Graph/Graph');


/**
 * @type {Item}
 */
var Item = require('../Graph/Item');

var items = todoListGraph.items();

var TodoActions = {

  /**
   * Add a todo item
   *
   * @param {{text:string}} opt
   */
  addTodoItem: function(opt) {
    var text = opt.text;
    if (!text || text.trim() === '') {
      return;
    }
    var todoListItem = {
      text: opt.text,
      isComplete: false
    };
    items.insert(Item.newInstance(todoListItem));
    items.saveVersion('Added todo item ' + opt.text);
  },

  /**
   * Remove a todo item
   *
   * @param {{item:Item}} opt
   */
  removeTodoItem: function(opt) {
    console.time('remove todo item');
    var item = opt.item;
    var text = item.read().text;
    item.remove();

    items.afterChange(function() {
      console.timeEnd('remove todo item');
      items.saveVersion('Removed todo item ' + text);
    }, true);
  },

  /**
   * Update a todo item
   *
   * @param {{item:Item}} opt
   */
  updateTodoItem: function(opt) {
    console.time('Update todo item');
    var item = opt.item.read();
    var newValue = clone(item);
    opt.text && (newValue.text = opt.text);
    'isComplete' in opt && (newValue.isComplete = opt.isComplete);

    if (newValue.text === item.text &&
        newValue.isComplete === item.isComplete) {
      return;
    }

    var oldText = item.text;
    var oldIsComplete = item.isComplete;
    opt.item.changeValueTo(newValue);
    items.afterChange(function() {
      console.timeEnd('Update todo item');
      items.saveVersion('Changed todo item from ' + oldText + ' ' +
          (oldIsComplete ? 'checked' : 'unchecked') +
          ' to ' + opt.text + ' ' + (opt.isComplete ? 'checked' : 'unchecked'));
    }, true);
  },

  /**
   * Remove all todo items
   *
   */
  removeAllTodoItems: function() {
    items.remove();
    items.saveVersion('Removed all todo items');
  },

  /**
   * Toggle edit mode
   *
   * @param opt
   */
  toggleEditMode: function(opt) {
    var item = opt.item;
    var newValue = clone(item.read());
    newValue.editMode = !newValue.editMode;
    item.changeValueTo(newValue);
  },

  /**
   * Update all todo items
   *
   * @param opt
   */
  updateAllTodoItems: function(opt) {
    console.time('Update all todo items');
    var checked = opt.checked;
    var itemsRead = clone(items.read());
    for (var i = 0, l = itemsRead.length; i < l; i++) {
      var item = clone(itemsRead[i].ref);
      item.isComplete = checked;
      itemsRead[i].ref = item;
    }
    items.changeValueTo(itemsRead);
    items.afterChange(function() {
      console.timeEnd('Update all todo items');
      items.saveVersion((checked ? 'Checked' : 'Unchecked') +
          ' all todo list items');
    }, true);
  },

  setFilter: function(opt) {
    console.time('Set filter');
    var newValue = clone(todoListGraph.read());
    newValue.filter = opt.filter;
    todoListGraph.changeValueTo(newValue);
    console.log('done!');
  },

  /**
   * Remove completed todo
   */
  removeCompletedTodo: function() {
    console.time('Remove completed todo');
    var completedItems = items.where({isComplete: true});
    for (var i = 0, l = completedItems.length; i < l; l--) {
      completedItems[l - 1].remove();
    }
    items.afterChange(function() {
      console.timeEnd('Remove completed todo');
      items.saveVersion('Removed all completed items');
    });
  }

};

module.exports = TodoActions;
