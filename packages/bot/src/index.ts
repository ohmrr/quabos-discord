import { client, prisma } from './utils/client.js';
import 'dotenv/config';
import logger from './utils/logger.js';
import loadEvents from './handlers/loadEvents.js';

async function init() {
  try {
    await prisma.$connect();
    await loadEvents();
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
