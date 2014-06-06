'use strict';


/**
 * @type {TodoList}
 */
var TodoList = require('../Graph/TodoList');

var todoList = TodoList.newInstance({
  items: [

  ]
});
todoList.items().enableVersioning();
todoList.items().saveVersion('initial');

module.exports = todoList;