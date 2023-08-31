import ExpressionNode from "./expressionNode";

export default class ifStatementNode extends ExpressionNode {
  condition: ExpressionNode;
  trueBranch: ExpressionNode;
  falseBranch: ExpressionNode | null;

  constructor(
    condition: ExpressionNode,
    trueBranch: ExpressionNode,
    falseBranch: ExpressionNode | null
  ) {
    super();
    this.condition = condition;
    this.trueBranch = trueBranch;
    this.falseBranch = falseBranch;
  }
}
