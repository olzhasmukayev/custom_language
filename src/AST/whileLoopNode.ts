import ExpressionNode from "./expressionNode";

export default class whileLoopNode extends ExpressionNode {
  condition: ExpressionNode;
  body: ExpressionNode;

  constructor(condition: ExpressionNode, body: ExpressionNode) {
    super();
    this.condition = condition;
    this.body = body;
  }
}
