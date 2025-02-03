import pino from "pino";
import path from "path";

const logPath = path.join("..", "..", "logs", "output.log");

const transport =
  process.env.NODE_ENV === "production"
    ? pino.transport({
        target: "pino-pretty",
        options: {
          destination: logPath,
          mkdir: true,
          colorize: false,
        },
        level: "info",
      })
    : pino.transport({
        target: "pino-pretty",
        options: { destination: 1, colorize: true },
        level: "debug",
      });

const logger = pino.pino(transport);

export default logger;
