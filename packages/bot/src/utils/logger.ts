import moment from 'moment-timezone';
import path from 'path';
import pino from 'pino';

const currentDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Los_Angeles',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).format(new Date()).replace(/\//g, '-');

const logFileName = `output-${currentDate}.log`;
const logPath = path.join('..', '..', 'logs', logFileName);

function customTimestamp() {
  const date = moment().tz('America/Los_Angeles').format('MM/DD/YY hh:mm:ss A');

  return `,"time":"${date}"`;
}


const transport =
  process.env.NODE_ENV === 'production'
    ? pino.transport({
      target: 'pino-pretty',
      options: {
        destination: logPath,
        mkdir: true,
        colorize: false,
        translateTime: false,
      },
      level: 'info'
    })
    : pino.transport({
      target: 'pino-pretty',
      options: { destination: 1, colorize: true, translateTime: false },
      level: 'debug',
    });

const logger = pino.pino(
  { timestamp: customTimestamp },
  transport
);

export default logger;
