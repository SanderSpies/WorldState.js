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
    items
      .insert(Item.newInstance(todoListItem))
      .saveVersionAs('Added todo item ' + opt.text);
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
    item
      .remove()
      .afterChange(function() {
        console.timeEnd('remove todo item');
      });

    items
      .saveVersionAs('Removed todo item ' + text);
  },

  /**
   * Update a todo item
   *
   * @param {{item:Item}} opt
   */
  updateTodoItem: function(opt) {
    console.time('Update todo item');
    var item = opt.item;

    var oldText = item.read().text;
    var oldIsComplete = item.read().isComplete;

    if (opt.text === oldText &&
      opt.isComplete === oldIsComplete) {
      return;
    }

    item
      .changePropertiesTo({
        isComplete:  'isComplete' in opt ? opt.isComplete : oldIsComplete,
        text: 'text' in opt ? opt.text : oldText
      })
      .afterChange(function() {
        console.timeEnd('Update todo item');
      });

    items
      .saveVersionAs('Changed todo item from ' + oldText + ' ' +
        (oldIsComplete ? 'checked' : 'unchecked') +
        ' to ' + opt.text + ' ' + (opt.isComplete ? 'checked' : 'unchecked'));
  },

  /**
   * Remove all todo items
   *
   */
  removeAllTodoItems: function() {
    items.remove();
  },

  /**
   * Toggle edit mode
   *
   * @param opt
   */
  toggleEditMode: function(opt) {
    var item = opt.item;
    item.changePropertiesTo({
      editMode: !item.read().editMode
    });
  },

  /**
   * Update all todo items
   *
   * @param opt
   */
  updateAllTodoItems: function(opt) {
    console.time('Update all todo items');
    items
      .changeChildrenPropertiesTo({
        isComplete: opt.checked
      })
      .saveVersionAs((opt.checked ? 'Checked' : 'Unchecked') +
        ' all todo list items')
      .afterChange(function() {
        console.timeEnd('Update all todo items');
      });
  },

  /**
   * Set a filter
   */
  setFilter: function(opt) {
    console.time('Set filter');
    todoListGraph.changePropertiesTo({
      filter: opt.filter
    });

    // TODO: fix me
    todoListGraph.__private.graph.__informChangeListeners();
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
      items.saveVersionAs('Removed all completed items');
    });
  }

};

module.exports = TodoActions;
