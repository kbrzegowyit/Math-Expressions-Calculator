import { CliService } from "./cli/cli.service.js";
import { ExpressionConverter } from "./entities/ExpressionConverter.entity.js";
import { ExpressionTokenizer } from "./entities/ExpressionTokenizer.entity.js";
import { MathExpression } from "./entities/MathExpression.entity.js";

//print tree
const expressionTokenizer = new ExpressionTokenizer();
const expressionConverter = new ExpressionConverter();
const cliService = new CliService(new MathExpression(expressionTokenizer, expressionConverter));

try {
    await cliService.run();
} catch (error) {
    console.log((error as Error).message);
}

