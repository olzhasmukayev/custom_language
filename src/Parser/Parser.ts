import binOperationNode from "../AST/binOperationNode";
import ExpressionNode from "../AST/expressionNode";
import numberNode from "../AST/numberNode";
import statementsNode from "../AST/statementsNode";
import unarOperationNode from "../AST/unarOperationNode";
import variableNode from "../AST/variableNode";
import Token from "../Token/Token";
import TokenType, { tokenTypesList } from "../TokenType/TokenType";

export default class Parser {
  tokens: Token[];
  pos: number = 0;
  scope: any = {};

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  match(...expected: TokenType[]): Token | null {
    if (this.pos < this.tokens.length) {
      const currentToken = this.tokens[this.pos];
      if (expected.find((type) => type.name === currentToken.type.name)) {
        this.pos += 1;
        return currentToken;
      }
    }
    return null;
  }

  require(...expected: TokenType[]): Token {
    const token = this.match(...expected);
    if (!token) {
      throw new Error(
        `Expected ${expected[0].name} on the position ${this.pos}`
      );
    }

    return token;
  }

  parseVariableOrNumber(): ExpressionNode {
    const number = this.match(tokenTypesList.NUMBER);
    if (number != null) {
      return new numberNode(number);
    }
    const variable = this.match(tokenTypesList.VARIABLE);
    if (variable != null) {
      return new variableNode(variable);
    }

    throw new Error(`Syntax error on postion ${this.pos}`);
  }

  parseParenthesis(): ExpressionNode {
    if (this.match(tokenTypesList.LPAR) != null) {
      const node = this.parseFormula();
      this.require(tokenTypesList.RPAR);
      return node;
    } else {
      return this.parseVariableOrNumber();
    }
  }

  parsePrint(): ExpressionNode {
    const operatorPrint = this.match(tokenTypesList.PRINT);
    if (operatorPrint != null) {
      return new unarOperationNode(operatorPrint, this.parseFormula());
    }

    throw new Error(`Syntax error on position ${this.pos}`);
  }

  parseFormula(): ExpressionNode {
    let leftNode = this.parseParenthesis();
    let operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS);
    while (operator != null) {
      const rightNode = this.parseParenthesis();
      leftNode = new binOperationNode(operator, leftNode, rightNode);
      operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS);
    }
    return leftNode;
  }

  parseExpression(): ExpressionNode {
    if (this.match(tokenTypesList.VARIABLE) == null) {
      const printNode = this.parsePrint();
      return printNode;
    }
    this.pos -= 1;
    let variableNode = this.parseVariableOrNumber();
    const assignOperator = this.match(tokenTypesList.ASSIGN);
    if (assignOperator != null) {
      const rightFormulaNode = this.parseFormula();
      const binaryNode = new binOperationNode(
        assignOperator,
        variableNode,
        rightFormulaNode
      );
      return binaryNode;
    }
    throw new Error(`Syntax error on postion ${this.pos}`);
  }

  parseCode(): ExpressionNode {
    const root = new statementsNode();
    while (this.pos < this.tokens.length) {
      const codeStringNode = this.parseExpression();
      this.require(tokenTypesList.SEMICOLON);
      root.addNode(codeStringNode);
    }
    return root;
  }

  run(node: ExpressionNode): any {
    if (node instanceof numberNode) {
      return parseInt(node.number.text);
    }
    if (node instanceof unarOperationNode) {
      switch (node.operator.type.name) {
        case tokenTypesList.PRINT.name:
          console.log(this.run(node.operand));
          return;
      }
    }
    if (node instanceof binOperationNode) {
      switch (node.operator.type.name) {
        case tokenTypesList.PLUS.name:
          return this.run(node.leftNode) + this.run(node.rightNode);
        case tokenTypesList.MINUS.name:
          return this.run(node.leftNode) - this.run(node.rightNode);
        case tokenTypesList.ASSIGN.name:
          const result = this.run(node.rightNode);
          const variableNode = <variableNode>node.leftNode;
          this.scope[variableNode.variable.text] = result;
          return result;
      }
    }
    if (node instanceof variableNode) {
      if (this.scope[node.variable.text]) {
        return this.scope[node.variable.text];
      } else {
        throw new Error(
          `Undeclared variable ${node.variable.text} is not defined`
        );
      }
    }
    if (node instanceof statementsNode) {
      node.codeStrings.forEach((codeString) => {
        this.run(codeString);
      });
      return;
    }
    throw new Error("Runtime error");
  }
}
