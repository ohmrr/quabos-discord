import pino from "pino";

const transport = pino.transport({
  targets: [
    {
      target: 'pino-pretty',
      options: { destination: 1, colorize: true },
      level: 'debug',
    },
    {
      target: 'pino-pretty',
      options: {
        destination: '../../logs/output.log', mkdir: true, colorize: false
      },
      level: 'info'
    }
  ]
})

const logger = pino(transport);

export default logger;