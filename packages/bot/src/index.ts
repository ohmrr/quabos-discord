import 'dotenv/config';
import loadCommands from './handlers/loadCommands.js';
import loadEvents from './handlers/loadEvents.js';
import { client, prisma } from './utils/client.js';
import logger from './utils/logger.js';

async function init() {
  try {
    await prisma.$connect();
    await loadEvents();
    await loadCommands();
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    logger.error(
      error,
      'There was an error initializing the application. Please ensure environment variables in .env are valid.',
    );
    process.exit(1);
  }
}

await init();
