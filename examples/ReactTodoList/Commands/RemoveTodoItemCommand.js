'use strict';

var CommandKeys = require('./CommandKeys');
var CommandRegistry = require('./CommandRegistry');


var graph = require('../Graph/Graph').graph;

/**
 * Remove a todo item
 */
var RemoveTodoItemCommand = {

  /**
   * @param {{item:Item}} opt
   */
  execute: function(opt) {
    var item = opt.item;
    var text = item.read().text;
    item.remove();
    var items = graph.items();
    var old = items.__private.graph.__private.changeListener;
    items.afterChange(function(){
      items.saveVersion('Removed todo item ' + text);
    });
  }

};

CommandRegistry.registerCommand(CommandKeys.RemoveTodoItem, RemoveTodoItemCommand);
