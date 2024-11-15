import pino from 'pino';
import path from 'path';

const subfolder = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
const logPath = path.join('..', '..', 'logs', subfolder, 'output.log');

const timeFormat = 'mm-dd-yyyy HH:MM:ss';

const transport = pino.transport({
  targets: [
    {
      target: 'pino-pretty',
      options: {
        destination: 1,
        translateTime: timeFormat,
        colorize: true,
      },
      level: 'debug',
    },
    {
      target: 'pino-pretty',
      options: {
        destination: logPath,
        translateTime: timeFormat,
        mkdir: true,
        colorize: false,
      },
      level: 'info',
    },
  ],
});

const logger = pino(transport);

export default logger;
