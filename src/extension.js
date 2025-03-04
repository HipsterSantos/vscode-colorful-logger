// src/extension.js
const vscode = require('vscode');

function activate(context) {
    // Diagnostic collection for errors
    const diagnostics = vscode.languages.createDiagnosticCollection('colorful-logger');
    context.subscriptions.push(diagnostics);

    // Hover provider for log previews
    const hoverProvider = vscode.languages.registerHoverProvider(
        ['javascript', 'typescript'],
        {
            provideHover(document, position) {
                const range = document.getWordRangeAtPosition(position, /\b(logger|log|authLog|paymentLog)\.(info|debug|warning|error|critical)\b/);
                if (!range) return null;

                const lineText = document.lineAt(position.line).text;
                const logMatch = lineText.match(/(logger|log|authLog|paymentLog)\.(info|debug|warning|error|critical)\((.*)\)/);
                if (!logMatch) return null;

                const [, loggerName, method, args] = logMatch;
                let message = '';
                let meta = {};

                // Parse arguments
                try {
                    const argsStr = args.trim().replace(/;?\s*$/, '');
                    const argParts = argsStr.split(/,\s*(?={|$)/);
                    message = eval(`(${argParts[0]})`); // Safely evaluate string literal
                    if (argParts[1]) {
                        meta = eval(`(${argParts[1]})`);
                    }
                } catch (e) {
                    return new vscode.Hover('Invalid log arguments');
                }

                // Simulate log output
                const logger = new (require('../src/logger.js'))(loggerName === 'log' ? 'ExampleApp' : loggerName);
                const output = logger.simulateLog(method.toUpperCase(), message, meta);

                // Markdown for hover with highlighting
                const markdown = new vscode.MarkdownString();
                markdown.appendMarkdown('**Expected Log Output:**\n\n');
                markdown.appendCodeblock(output, 'plaintext');
                markdown.appendMarkdown('\n**Highlights:**\n');
                markdown.appendMarkdown(`- **Level**: ${method.toUpperCase()}\n`);
                markdown.appendMarkdown(`- **Message**: ${message}\n`);
                if (Object.keys(meta).length) markdown.appendMarkdown(`- **Metadata**: ${JSON.stringify(meta)}\n`);

                return new vscode.Hover(markdown, range);
            }
        }
    );

    // Error detection and diagnostics
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            const document = event.document;
            diagnostics.clear();
            const errors = [];

            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i).text;
                const errorMatch = line.match(/(logger|log|authLog|paymentLog)\.error\((.*)\)/);
                if (errorMatch) {
                    const [, loggerName, args] = errorMatch;
                    const range = new vscode.Range(i, line.indexOf('error'), i, line.length);
                    const diagnostic = new vscode.Diagnostic(
                        range,
                        'Potential error logged here',
                        vscode.DiagnosticSeverity.Warning
                    );

                    let message = '';
                    let meta = {};
                    try {
                        const argsStr = args.trim().replace(/;?\s*$/, '');
                        const argParts = argsStr.split(/,\s*(?={|$)/);
                        message = eval(`(${argParts[0]})`);
                        if (argParts[1]) meta = eval(`(${argParts[1]})`);
                    } catch (e) {
                        diagnostic.message = 'Invalid error arguments';
                    }

                    diagnostic.relatedInformation = [
                        new vscode.DiagnosticRelatedInformation(
                            new vscode.Location(document.uri, range),
                            `Error: ${message}${meta.stack ? '\nStack: ' + meta.stack : ''}`
                        )
                    ];

                    // Suggest fix if meta is an Error object
                    if (meta instanceof Error || meta.stack) {
                        diagnostic.code = 'suggest-fix';
                        diagnostic.message += '\n\n**Suggested Fix**: Check the error source or add try-catch.';
                    }

                    errors.push(diagnostic);
                }
            }

            diagnostics.set(document.uri, errors);
        })
    );

    context.subscriptions.push(hoverProvider);
}

function deactivate() {}

module.exports = { activate, deactivate };