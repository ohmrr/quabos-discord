import 'dotenv/config';
import loadCommands from './handlers/loadCommands';
import loadEvents from './handlers/loadEvents';
import { client, prisma } from './utils/client';
import logger from './utils/logger';

async function init() {
  await prisma.$connect();
  await loadEvents();
  await loadCommands();
  await client.login(process.env.DISCORD_TOKEN);
}

init()
  .catch(error => {
    logger.fatal(error, 'Unable to initialize application.');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
