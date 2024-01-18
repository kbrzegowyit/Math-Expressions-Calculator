import { Token, TokenType } from "./ExpressionTokenizer.entity.js";

export class ExpressionConverter {
    public covertToPostfix(tokens: Token[]) {
        const postfix: Token[] = [];
        const stack: Token[] = [];
        
        tokens.forEach((token: Token) => {
            if (token.type === TokenType.Number) {
                postfix.push(token);
            } else if (token.type === TokenType.Operator) {
                if (!stack.length) {
                    stack.push(token);
                } else {
                    const prevPrecedence = this.precedence((<Token>stack.at(-1)).value);
                    const currPrecedence = this.precedence(token.value);

                    if (currPrecedence > prevPrecedence) {
                        stack.push(token);
                    } else {
                        do {
                            if (!stack.length) break;
                            const prev = stack.pop();
                            const prevPrecedence = this.precedence((<Token>prev).value);
                            if (prevPrecedence < currPrecedence) {
                                stack.push(<Token>prev);
                                break;
                            }
                            postfix.push(<Token>prev);
                        } while (true)
                        stack.push(token);
                    }
                }
            } else if (token.type === TokenType.LeftParenthesis) {
                stack.push(token);
            } else if (token.type === TokenType.RightParenthesis) {
                do {
                    if (!stack.length) break;
                    const prev = <Token>stack.pop();
                    if (prev.value === '(') break;
                    postfix.push(prev);
                } while (true)
            }
            // console.log(`Char ${token.value} | Postfix ${postfix.map(token => token.value).join('')} | Stack ${stack.map(token => token.value).join('')}`);
        });

        while (stack.length) {
            const prev = <Token>stack.pop();
            postfix.push(prev);
        }
                
        return postfix;
    }

    private precedence(char: string): number {
        switch(char) {
            case '^':
                return 3;
            case '*':
            case '/':
                return 2;
            case '+':
            case '-':
                return 1;
            default:
                return -1;
        }
    }
}