import loadCommands from './handlers/loadCommands.js';
import loadEvents from './handlers/loadEvents.js';
import { client, prisma } from './utils/client.js';
import config from './utils/config.js';
import logger from './utils/logger.js';

async function init() {
  try {
    await prisma.$connect();
    await Promise.all([loadEvents(), loadCommands()]);
    await client.login(config.discordToken);
  } catch (error) {
    logger.error(
      error,
      'There was an error initializing the application. Please ensure environment variables in .env are valid.',
    );
    process.exit(1);
  }
}

await init();
