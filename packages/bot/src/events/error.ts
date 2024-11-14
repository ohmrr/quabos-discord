import { createEvent } from '../interfaces/applicationEvent';
import logger from '../utils/logger';

const error = createEvent('error', false, error => {
  logger.error(error);
});

export default error;
