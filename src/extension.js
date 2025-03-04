// src/extension.js
const vscode = require('vscode');

function activate(context) {
    // Hover provider for log output previews and error details
    console.log('Colorful Logger Helper activated');
    const hoverProvider = vscode.languages.registerHoverProvider(
        ['javascript', 'typescript'],
        {
            provideHover(document, position) {
                console.log('Hover triggered at:', position.line);
                const range = document.getWordRangeAtPosition(position, /\b(logger|log|authLog|paymentLog)\.(info|debug|warning|error|critical)\b/);
                if (!range) return null;

                const lineText = document.lineAt(position.line).text;
                const logMatch = lineText.match(/(logger|log|authLog|paymentLog)\.(info|debug|warning|error|critical)\((.*)\)/);
                if (!logMatch) return null;

                const [, loggerName, method, args] = logMatch;
                let message = '';
                let meta = {};

                // Parse arguments safely
                try {
                    const argsStr = args.trim().replace(/;?\s*$/, '');
                    const argParts = argsStr.split(/,\s*(?={|$)/);
                    message = argParts[0] ? eval(`(${argParts[0]})`) : ''; // Evaluate string literal
                    if (argParts[1]) meta = eval(`(${argParts[1]})`) || {};
                } catch (e) {
                    return new vscode.Hover('Invalid log arguments');
                }

                // Simulate log output
                const Logger = require('@hipstersantos/colorful-logger');
                const logger = new Logger(loggerName === 'log' ? 'ExampleApp' : loggerName);
                const output = logger.simulateLog(method.toUpperCase(), message, meta);

                // Markdown for hover tooltip
                const markdown = new vscode.MarkdownString();
                markdown.appendMarkdown('**Log Preview:**\n\n');
                markdown.appendCodeblock(output, 'plaintext');

                // Highlight important parts
                markdown.appendMarkdown('\n**Details:**\n');
                markdown.appendMarkdown(`- **Level**: \`${method.toUpperCase()}\`\n`);
                markdown.appendMarkdown(`- **Message**: \`${message}\`\n`);
                if (Object.keys(meta).length) {
                    markdown.appendMarkdown(`- **Metadata**: \`${JSON.stringify(meta)}\`\n`);
                }

                // Error-specific details and fixes
                if (method === 'error' || method === 'critical') {
                    markdown.appendMarkdown('\n**Error Analysis:**\n');
                    if (meta.stack) {
                        markdown.appendMarkdown(`- **Stack Trace**: \n\`\`\`\n${meta.stack}\n\`\`\`\n`);
                    }
                    markdown.appendMarkdown('- **Suggested Fix**: Wrap in try-catch or check input values.\n');
                    markdown.appendMarkdown('```javascript\ntry {\n  ' + lineText.trim() + '\n} catch (e) {\n  logger.error("Handled error", e);\n}\n```');
                }

                return new vscode.Hover(markdown, range);
            }
        }
    );

    context.subscriptions.push(hoverProvider);
}

function deactivate() {}

module.exports = { activate, deactivate };