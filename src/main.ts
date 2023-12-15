import { ExpressionConverter } from "./entities/ExpressionConverter.entity";
import { ExpressionTokenizer } from "./entities/ExpressionTokenizer.entity";
import { MathExpression } from "./entities/MathExpression.entity";

// print tree

console.log('Expression calculator', '1100 / 30');
const expression = '11010 / 30';
const expressionTokenizer = new ExpressionTokenizer();
const expressionConverter = new ExpressionConverter();
const mathExpression = new MathExpression(expressionTokenizer, expressionConverter);
const result = mathExpression.calculate(expression);
console.log('Result',result);
