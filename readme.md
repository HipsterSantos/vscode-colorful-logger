Colorful Logger Helper
A VSCode extension that enhances the @hipstersantos/colorful-logger library by providing in-editor log previews and error diagnostics. See your log output directly in a hover tooltip—similar to built-in function documentation—without needing to check the terminal.
GitHub Repository | VSCode Marketplace (Coming soon)
 Features
Hover Log Previews: Mouse over logger.info, debug, warning, error, or critical to see the simulated output in a tooltip (e.g., [INFO] Message with metadata).

Highlighted Details: Emphasizes log level, message, and metadata for quick understanding.

Error Diagnostics: Displays stack traces and suggested fixes for logger.error calls directly in the editor.

Seamless Integration: Works with @hipstersantos/colorful-logger in JavaScript and TypeScript files.

No Terminal Needed: Keeps your debugging workflow within VSCode.

 Installation
From VSCode Marketplace (Once Published)
Open VSCode.

Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X on Mac).

Search for Colorful Logger Helper by hipstersantos.

Click Install.

Manual Installation
Clone the repository:
bash

git clone https://github.com/HipsterSantos/colorful-logger.git
cd colorful-logger-vscode

Install dependencies:
bash

npm install

Package the extension:
bash

npm run package

Install the .vsix file in VSCode:
bash

code --install-extension colorful-logger-vscode-0.0.2.vsix

Prerequisites
Install @hipstersantos/colorful-logger in your project:
bash

npm install @hipstersantos/colorful-logger

 Quick Start
Use the logger in your JavaScript or TypeScript code:
javascript

const Logger = require('@hipstersantos/colorful-logger');
const logger = Logger.getLogger('MyApp');
logger.info('App started', { userId: 123 });
logger.error('DB failed', new Error('Timeout'));

Open the file in VSCode.

Hover over a logger call to see the preview tooltip.

Example Hover Outputs
Info Log
javascript

logger.info('App started', { userId: 123 });

Hover:

**Log Preview:**
[2025-03-04TXX:XX:XX] [MyApp] [INFO] [file.js:10:5] App started
Meta: {"userId": 123}

**Details:**
- **Level**: `INFO`
- **Message**: `App started`
- **Metadata**: `{"userId": 123}`

Error Log
javascript

logger.error('DB failed', new Error('Timeout'));

Hover:

**Log Preview:**
[2025-03-04TXX:XX:XX] [MyApp] [ERROR] [file.js:15:5] DB failed
Meta: {"stack": "Error: Timeout..."}

**Details:**
- **Level**: `ERROR`
- **Message**: `DB failed`
- **Metadata**: `{"stack": "Error: Timeout..."}

**Error Analysis:**
- **Stack Trace**:

Error: Timeout...

- **Suggested Fix**: Wrap in try-catch or check input values.
```javascript
try {
  logger.error('DB failed', new Error('Timeout'));
} catch (e) {
  logger.error("Handled error", e);
}

---

## 📖 Usage Examples

These examples assume `@hipstersantos/colorful-logger` is installed. Hover over each line in VSCode with the extension active to see the magic!

### Basic Logging
```javascript
const logger = Logger.getLogger('App');
logger.info('Starting app');          // Hover: [INFO] preview
logger.debug('Debugging');            // Hover: [DEBUG] preview
logger.warning('Low resources');      // Hover: [WARNING] preview
logger.error('Crash');                // Hover: [ERROR] preview
logger.critical('System failure');    // Hover: [CRITICAL] preview

Metadata
javascript

logger.info('User login', { id: 42 });              // Hover: Shows metadata
logger.warning('Limit near', { limit: 100, current: 99 }); // Hover: Multi-field metadata
logger.error('Validation', { field: 'email' });     // Hover: Error with metadata

Error Handling
javascript

logger.error('API error', new Error('Network'));    // Hover: Stack trace + fix
setTimeout(() => logger.critical('Timeout', { stack: logger.getFullStack() }), 1000); // Hover: Critical preview

Customization
javascript

const custom = new Logger('Custom', { showTimestamp: false });
custom.info('No time'); // Hover: No timestamp in preview

 Configuration
The extension uses the logger’s configuration from your code (e.g., showTimestamp, env). No additional setup is needed beyond installing the extension and library.
 API Reference
The extension enhances these @hipstersantos/colorful-logger methods:
info(message, meta): Blue info log preview.

debug(message, meta): Cyan debug preview (hidden in production).

warning(message, meta): Yellow warning preview.

error(message, meta): Red error preview with diagnostics.

critical(message, meta): Red background critical preview with diagnostics.

See the library README for full API details.
 Testing
Open a JS/TS file with logger calls.

Hover over lines to verify tooltips.

Check error lines for stack traces and fix suggestions.

 License
MIT License (LICENSE)
 Contributing
Fork, branch, and submit PRs at GitHub. Report issues or suggest features in the issue tracker.
 Contact
Author: hipstersantos (mailto:santoscampos269@gmail.com)
 Changelog
0.0.2 (March 2025):
In-editor hover previews for all log levels.

Error diagnostics with stack traces and fixes.

0.0.1: Initial release.

