// src/extension.js
const vscode = require('vscode');
const Logger = require('@hipstersantos/colorful-logger');

function activate(context) {
  console.log('[Colorful Logger Helper] Extension activated'); // Debug log
  const hoverProvider = vscode.languages.registerHoverProvider(
    ['javascript', 'typescript'],
    {
      provideHover(document, position) {
        console.log('[Colorful Logger Helper] Hover triggered at line:', position.line); // Debug log
        const range = document.getWordRangeAtPosition(position, /\b(logger|log|authLog|paymentLog)\.(info|debug|warning|error|critical)\b/);
        if (!range) {
          console.log('[Colorful Logger Helper] No logger match at:', position.line);
          return null;
        }

        const lineText = document.lineAt(position.line).text;
        const logMatch = lineText.match(/(logger|log|authLog|paymentLog)\.(info|debug|warning|error|critical)\((.*)\)/);
        if (!logMatch) {
          console.log('[Colorful Logger Helper] No full match at:', position.line);
          return null;
        }

        const [, loggerName, method, args] = logMatch;
        let message = '';
        let meta = {};

        try {
          const argsStr = args.trim().replace(/;?\s*$/, '');
          const argParts = argsStr.split(/,\s*(?={|$)/);
          message = argParts[0] ? eval(`(${argParts[0]})`) : '';
          if (argParts[1]) meta = eval(`(${argParts[1]})`) || {};
        } catch (e) {
          console.log('[Colorful Logger Helper] Invalid args at:', position.line, e);
          return new vscode.Hover('Invalid log arguments');
        }

        const logger = new Logger(loggerName === 'log' ? 'ExampleApp' : loggerName);
        const output = logger.simulateLog(method.toUpperCase(), message, meta);

        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown('**Log Preview:**\n\n');
        markdown.appendCodeblock(output, 'plaintext');
        markdown.appendMarkdown('\n**Details:**\n');
        markdown.appendMarkdown(`- **Level**: \`${method.toUpperCase()}\`\n`);
        markdown.appendMarkdown(`- **Message**: \`${message}\`\n`);
        if (Object.keys(meta).length) {
          markdown.appendMarkdown(`- **Metadata**: \`${JSON.stringify(meta)}\`\n`);
        }

        if (method === 'error' || method === 'critical') {
          markdown.appendMarkdown('\n**Error Analysis:**\n');
          if (meta.stack) {
            markdown.appendMarkdown(`- **Stack Trace**: \n\`\`\`\n${meta.stack}\n\`\`\`\n`);
          }
          markdown.appendMarkdown('- **Suggested Fix**: Wrap in try-catch.\n');
          markdown.appendMarkdown('```javascript\ntry {\n  ' + lineText.trim() + '\n} catch (e) {\n  logger.error("Handled", e);\n}\n```');
        }

        return new vscode.Hover(markdown, range);
      }
    }
  );
  context.subscriptions.push(hoverProvider);
}

function deactivate() {}

module.exports = { activate, deactivate };