import Token from "../Token/Token";
import ExpressionNode from "./expressionNode";

export default class unarOperationNode {
  operator: Token;
  operand: ExpressionNode;

  constructor(operator: Token, operand: ExpressionNode) {
    this.operator = operator;
    this.operand = operand;
  }
}
