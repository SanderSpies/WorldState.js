// parse:
// - properly handle variable/function declarations
//   - attach to function / application
//   - attach to lineNumbers
// - create function to find variables:
//   - if inside function refer to that variable
//   - could be a given argument
//   - otherwise should be part of the "calling-context"
//   - (for now) do not handle arguments or spread
// - handle assignments
//   - properly "flow" from 1 variable to another
// - function call
//   - out to the function
//   - in argument nodes
//   - in "calling-context"
// - everything else inside a file
// - multiple files o.O


// parse file using recast
// build graph
// add pointers
// this -> refer to *calling context*
// add support for require (es6 modules would be nice also)

var recast    = require('recast');
var types     = recast.types;
var n         = types.namedTypes;
var b         = types.builders;

var code = [
  "function add(a, b) {",
  "  var z3;",
  "  var b = 3;",
  "  var z = b = 3;",
  "  return a +",
  "    // Weird formatting, huh?",
  "    b;",
  "}" +
  "function b2(a, b) {",
  "  function b3(a, b) {",
  "    var z = add(5, 4);",
  "  }",
  "};"
].join("\n");

var ast = recast.parse(code);
var addGraphToAST = require('./addGraphToAST');
addGraphToAST(ast);