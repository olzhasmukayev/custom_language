import Token from "../Token/Token";
import ExpressionNode from "./expressionNode";

export default class variableNode extends ExpressionNode {
  variable: Token;

  constructor(variable: Token) {
    super();
    this.variable = variable;
  }
}
