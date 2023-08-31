import ExpressionNode from "./expressionNode";

export default class statementsNode extends ExpressionNode {
  codeStrings: ExpressionNode[] = [];

  addNode(node: ExpressionNode) {
    this.codeStrings.push(node);
  }
}
