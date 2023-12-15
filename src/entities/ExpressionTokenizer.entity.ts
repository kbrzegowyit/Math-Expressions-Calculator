export enum TokenType {
    Number = 'Number',
    Operator = 'Operator',
    LeftParenthesis = 'LeftParenthesis',
    RightParenthesis = 'RightParenthesis',
}

export type Token = {
    type: TokenType,
    value: string,
}

export class ExpressionTokenizer {
    public tokenize(expression: string): Token[] {
        const tokens: Token[] = [];
        let buffer: string[] = [];
        const flushBuffer = () => {
            if (!buffer.length) return;
            const value = buffer.join('');
            tokens.push({ type: TokenType.Number, value });
            buffer = [];
        }
        expression = expression.replace(/\s+/g, '');
        expression.split('').forEach((char: string) => {
            if (this.isNumber(char)) {
                buffer.push(char);
            } else if (this.isOperator(char)) {
                flushBuffer();
                tokens.push({ type: TokenType.Operator, value: char });
            } else if (this.isLeftParenthesis(char)) {
                flushBuffer();
                tokens.push({ type: TokenType.LeftParenthesis, value: char });
            } else if (this.isRightParenthesis(char)) {
                flushBuffer();
                tokens.push({ type: TokenType.RightParenthesis, value: char });
            }
        });
        if (buffer.length) tokens.push({ type: TokenType.Number, value: buffer.join('') });
        return tokens;
    }

    private isNumber(char: string): boolean {
        return /\d+/.test(char);
    }
    
    private isOperator(char: string): boolean {
        return /\+|-|\*|\/|\^/.test(char);
    }
    
    private isRightParenthesis(char: string): boolean {
        return /\)/.test(char);
    }
    
    private isLeftParenthesis(char: string): boolean {
        return /\(/.test(char);
    }
}