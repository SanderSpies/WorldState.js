'use strict';

var recast = require('recast');
var worldstate = require('../../lib');

var NodeTypes = {
  FUNCTION_DECLARATION: 1,
  VARIABLE_DECLARATION: 2,
  CALL_EXPRESSION: 3,
  LITERAL: 4,
  PARAM: 5
};

var EdgeLabels = {
  CONTAINS: 'contains',
  FLOW: 'flow'
};
var counter = 1;
var currentBlockId = -1;
function addGraphToAST(ast) {
  var basicGraphData = {
    nodes: [],
    edges: [],
    edgeLabels: {
      inside: {
        id: EdgeLabels.CONTAINS
      },
      in: {
        id: EdgeLabels.FLOW
      }
    }
  };

  var graph = worldstate.create(basicGraphData);

  function findNode(node, type) {
    var nodes = graph.all();
    for (var i = 0, l = nodes.length; i < l; i++) {
      var _node = nodes[i];
      if (_node.value && _node.value === node && (!type || _node.type === type)) {
        return _node;
      }
    }
  }

  function findFunctionNode(fnName) {
    var nodes = graph.all();
    for (var i = nodes.length -1, l = 0; i > l; i--) {
      var node = nodes[i];
      if (node.type === NodeTypes.FUNCTION_DECLARATION && node.value.id.name === fnName) {
        return node;
      }
    }
  }

  var visitor = {

    visitFunctionDeclaration: function(path) {
      var id = counter++;

      var node = {
        type: NodeTypes.FUNCTION_DECLARATION,
        value: path.value,
        id: id
      };

      var source =  findNode(path.parentPath.parentPath.parentPath.value);

      var edge = {
        label: EdgeLabels.CONTAINS,
        source: source.id,
        target: id
      };
      var nodes = [node];
      var edges = [edge];
      var edgeLabels = {};

      // TODO: arguments
      var params = path.value.params;
      for (var i = 0, l = params.length; i < l; i++) {
        var param = params[i];

        var paramId = counter++;
        nodes.push({
          type: NodeTypes.VARIABLE_DECLARATION,
          value: {
            id: {
              name: param.name
            }
          },
          isParam: true,
          id: paramId
        });

        edges.push({
          label: EdgeLabels.CONTAINS,
          source: id,
          target: paramId
        });
      }

      graph.add({
        nodes: nodes,
        edges: edges,
        edgeLabels: edgeLabels
      });

      this.traverse(path);
    },

    visitVariableDeclarator: function(path) {
      var id = counter++;
      currentBlockId = id;
      var node = {
        type: NodeTypes.VARIABLE_DECLARATION,
        value: path.value,
        id: id
      };
      var containsEdge = {
        label: EdgeLabels.CONTAINS,
        source: currentBlockId,
        target: id
      };
      var nodes = [node];
      var edges = [containsEdge];
      var edgeLabels = {};
      graph.add({
        nodes: nodes,
        edges: edges,
        edgeLabels: edgeLabels
      });

      var init = path.value.init;
      if (init) {
        if (init.type === 'Literal') {
          console.log('TODO: add support for init literal');
        }
        else if (init.type === 'AssignmentExpression') {
          console.log('TODO: add support for init literal');
        }
        else {
          console.log('TODO: add support for:', init.type);
        }
      }

      this.traverse(path);
    },

    visitCallExpression: function(path) {
      var callExpressionId = counter++;
      var pathValue = path.value;
      var node = {
        type: NodeTypes.CALL_EXPRESSION,
        value: pathValue,
        id: callExpressionId
      };
      var functionName = pathValue.callee.name;
      var callArguments = pathValue.arguments;
      var nodes = [node];
      var edges = [];
      var edgeLabels = {};

      for (var i = 0, l = callArguments.length; i < l; i++) {
        var callArgument = callArguments[i];
        var callArgumentType = callArgument.type;
        var callArgumentValue = callArgument.value;
        if (callArgumentType === 'Literal') {
          var literal = findNode(callArgumentValue, NodeTypes.LITERAL);
          var literalId = counter++;
          if (!literal) {
            nodes.push({
              type: NodeTypes.LITERAL,
              value: pathValue,
              id: literalId
            });
          } else {
            literalId = literal.id;
          }
          edges.push({
            label: EdgeLabels.FLOW,
            source: literalId,
            target: callExpressionId
          });
        } else {
          console.log('TODO: support argument type:', callArgumentType);
        }
      }

      edges.push({
        label: EdgeLabels.FLOW,
        source: callExpressionId,
        target: findFunctionNode(functionName).id
      });

      graph.add({
        nodes: nodes,
        edges: edges,
        edgeLabels: edgeLabels
      });

      this.traverse(path);
    },

    visitAssignmentExpression: function(path) {
      var pathValue = path.value;
      var operator = pathValue.operator;


      // position
      // from variable to variable

      // node: connect to line number node, (linenumber)
      //       connect to out node, (out)
      //       connect to in node, (in)
      //       connect to block node (inside)
      //
      // {type: AssignmentExpression}

      this.traverse(path);
    },

    visitBinaryExpression: function(path) {
      console.log('TODO: support binary expression');
      this.traverse(path);
    },

    visitReturnStatement: function(path) {
      console.log('TODO: return statement');

      // TODO: should flow towards caller

      this.traverse(path);
    },

    visitBlockStatement: function(path) {
    //  console.log('block');
      // console.log('oh hai block:', path.value);
      // TODO: create node for this block
      this.traverse(path, visitor)
    }
  };

  recast.visit(ast, {

    visitFile: function(path) {
      var nodes = [{
        type: 'File',
        id: 0,
        value: path.value
      }];
      currentBlockId = 0;
      var edges = [];
      var edgeLabels = {};
      graph.add({
        nodes: nodes,
        edges: edges,
        edgeLabels: edgeLabels
      });

      this.traverse(path, visitor);
    }

  });
}

module.exports = addGraphToAST;
