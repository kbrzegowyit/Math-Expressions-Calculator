import chalk from 'chalk';
import { MathExpression } from '../entities/MathExpression.entity.js';

export class CliService {
    constructor(private readonly mathExpression: MathExpression) {}

    public async run() {
        const expression = await this.readExpression();
        const result = this.mathExpression.calculate(expression);
        process.stdout.write(chalk.greenBright.bold(`Result: ${result}`));
    }

    private async readExpression(): Promise<string> {
        const expression = this.readUserInput('Enter math expression:');
        if (!expression) {
            console.log('Expression is required');
            return this.readExpression();
        }
        return expression;
    }

    private async readUserInput(question: string): Promise<string> {
        const blueQuestion = chalk.blueBright.bold(question);
        return new Promise((resolve, _reject) => {
            this.clearConsole();
            process.stdout.write(blueQuestion + ' ');
            process.stdin.on('data', (data) => {
                resolve(data.toString().trim());
            });
        });
    }

    private clearConsole() {
        console.clear();
    }
}