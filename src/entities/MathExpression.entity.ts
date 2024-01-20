import chalk from "chalk";
import { ExpressionConverter } from "./ExpressionConverter.entity.js";
import { Token, ExpressionTokenizer, TokenType } from "./ExpressionTokenizer.entity.js";

type ExpressionNode = {
    data: Token,
    left: ExpressionNode | null,
    right: ExpressionNode | null,
}

export class MathExpression {
    constructor(private readonly expressionTokenizer: ExpressionTokenizer, private readonly expressionConverter: ExpressionConverter) {}

    public calculate(expression: string): number {
        const tokens = this.expressionTokenizer.tokenize(expression);
        const postfix = this.expressionConverter.covertToPostfix(tokens);
        const result = this.evaluate(postfix);
        return Number(result.toFixed(2));
    }

    private evaluate(postfix: Token[]): number {
        const expressionRoot = this.buildBinaryTree(postfix);
        this.displayTreeConsole(expressionRoot);
        this.evaluateBinaryTree(expressionRoot);
        return Number(expressionRoot.data.value);
    }
 
    private buildBinaryTree(tokens: Token[]): ExpressionNode {
        const stack: ExpressionNode[] = [];
        tokens.forEach((token) => {
            if (token.type === TokenType.Number) {
                stack.push({ data: token, left: null, right: null });
            } else if (token.type === TokenType.Operator) {
                const right = <ExpressionNode>stack.pop();
                const left = <ExpressionNode>stack.pop();
                stack.push({ data: token, left, right })
            }
        });
        return <ExpressionNode>stack.pop();
    }

    private displayTreeConsole(node: ExpressionNode): void {
        let height = this.calcTreeHeight(node);
        let width = this.calcColumnsNumber(height);
        let matrix: string[][] = new Array(height).fill('').map(() => new Array(width).fill(' '));

        this.fillMatrix(matrix, node, Math.floor(width / 2), 0, height);
    
        for (let i = 0; i < matrix.length; i++) {
            let row = '';
            for (let j = 0; j < width; j++) {
                row += matrix[i][j];
            }
            console.log(chalk.bgCyanBright(row));
        }
    }

    private calcTreeHeight(node: ExpressionNode | null): number {
        if (!node) return 0;
        return Math.max(this.calcTreeHeight(node.left), this.calcTreeHeight(node.right)) + 1;
    }

    private calcColumnsNumber(treeHeight: number): number {
        return Math.pow(2, treeHeight - 1) + Math.pow(2, treeHeight - 1) - 1;
    }

    private fillMatrix(matrix: string[][], node: ExpressionNode | null, col: number, row: number, height: number): void {
        if (!node) {
            return;
        }

        matrix[row][col] = node.data.value;

        this.fillMatrix(matrix, node.left, col - Math.pow(2, height - 2), row + 1, height - 1);
        this.fillMatrix(matrix, node.right, col + Math.pow(2, height - 2), row + 1, height - 1);
    }

    private evaluateBinaryTree(currNode: ExpressionNode) {
        if (!currNode) return;
        
        if (currNode.left) {    
            this.evaluateBinaryTree(currNode.left);
        } 
        
        if (currNode.right) {
            this.evaluateBinaryTree(currNode.right);
        }
    
        if (currNode.data.type === TokenType.Operator) {
            const result = this.calculateSubExpression(currNode);
            this.updateNode(currNode, result.toString(), TokenType.Number);
        };
    
        return;
    }

    private calculateSubExpression(node: ExpressionNode): number {
        if (!node || node.data.type !== TokenType.Operator) {
            throw new Error('Subexpression is not valid!');
        }

        const operator = node.data.value;
        const left = node.left;
        const right = node.right;

        if (!left || isNaN(Number(left.data.value))) {
            throw new Error('Left expression is not number!');
        }

        if (!right || isNaN(Number(right.data.value))) {
            throw new Error('Right expression is not number!');
        }

        const leftValue = Number(left.data.value);
        const rightValue = Number(right.data.value);

        switch (operator) {
            case '+':
                return leftValue + rightValue;
            case '-':
                return leftValue - rightValue;
            case '/':
                return leftValue / rightValue;
            case '*':
                return leftValue * rightValue;
            default:
                throw new Error('This operator is not supported!');
        }
    }

    private updateNode(node: ExpressionNode, value: string, type: TokenType) {
        node.data.value = value;
        node.data.type = type;
    }
}