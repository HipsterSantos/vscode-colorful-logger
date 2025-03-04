// test.js
const Logger = require('@hipstersantos/colorful-logger');
const logger = Logger.getLogger('TestApp');

// Basic log examples
logger.info('Application started', { userId: 122 });
logger.debug('Debugging mode', { enabled: true });
logger.warning('Low memory', { free: '500MB' });
logger.error('Connection failed', new Error('Network timeout'));
logger.critical('System crash', { reason: 'Overload' });