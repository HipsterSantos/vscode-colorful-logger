// test.js
const Logger = require('@hipstersantos/colorful-logger');
const logger = Logger.getLogger('TestApp');
logger.info('App started', { userId: 123 });
logger.error('DB failed', new Error('Timeout'));