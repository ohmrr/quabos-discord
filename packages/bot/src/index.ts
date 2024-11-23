import { PrismaClient } from '@prisma/client';
import { client } from './utils/quabos';
import 'dotenv/config';
import loadCommands from './handlers/loadCommands';
import loadEvents from './handlers/loadEvents';
import logger from './utils/logger';

const prisma = new PrismaClient();

async function init() {
  await prisma.$connect();
  await loadEvents();
  await loadCommands();
  await client.login(process.env.DISCORD_TOKEN);
}

init()
  .catch(error => {
    logger.fatal(error, 'Unable to initialize database and client.');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { prisma };
