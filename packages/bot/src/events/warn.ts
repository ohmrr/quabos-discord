import { createEvent } from '../interfaces/applicationEvent';
import logger from '../utils/logger';

const warn = createEvent('warn', false, message => {
  logger.warn(message);
});

export default warn;
