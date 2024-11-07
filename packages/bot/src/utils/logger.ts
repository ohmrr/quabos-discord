import pino from "pino";

const timeFormat = 'dd-mm-yyyy HH:MM:ss';

const transport = pino.transport({
  targets: [
    {
      target: 'pino-pretty',
      options: { destination: 1, translateTime: timeFormat, colorize: true },
      level: 'debug',
    },
    {
      target: 'pino-pretty',
      options: {
        destination: '../../logs/output.log', translateTime: timeFormat, mkdir: true, colorize: false
      },
      level: 'info'
    }
  ]
})

const logger = pino(transport);

export default logger;