Idea
===
In this example an abstract syntax tree (AST) is extended with WorldState. This
should make it possible to do more complex code modifications, like renaming a
variable at all used locations.

For now this example is rather simple, and should not be taken too seriously.
Feel free to hack on it and do a PR.

It's limited to:
- FunctionDeclaration
- VariableDeclaration
- AssignmentExpression
- CallExpression

Should work less then stellar for now.

Node types
---
- Program
- FunctionDeclaration
- VariableDeclaration
- AssignmentExpression
- CallExpression
- Line
- BlockStatement

Edge types
---
- contains
- flow

