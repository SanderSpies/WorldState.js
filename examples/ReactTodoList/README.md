TodoList written with React.js and WorldState.js
===
In [TodoActions.js](Actions/TodoActions.js) the modifications to the graph happen.

In [TodoListComponent.js](Components/TodoListComponent.js) and
[TodoListItemComponent.js](Components/TodoListItemComponent.js) you can see how WorldState.js is being used for reading
data.

And if you want to generate the graph yourself:

```
npm install -g worldstate
```

Install NPM packages:
```
npm install
```

To (re)create the graph for the todo list:
```
worldstate Graph/input Graph
```

Run grunt:
```
grunt
```

Be in awe.