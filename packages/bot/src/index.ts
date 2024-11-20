import { PrismaClient } from '@prisma/client';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import 'dotenv/config';
import { version } from '../package.json';
import loadCommands from './handlers/loadCommands';
import loadEvents from './handlers/loadEvents';
import logger from './utils/logger';

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Message, Partials.Channel],
  allowedMentions: {
    repliedUser: true,
    parse: ['roles', 'users'],
  },
});

const prisma = new PrismaClient();
client.version = `v${version}`;
client.cooldowns = new Collection();

async function init() {
  await prisma.$connect();
  await loadEvents(client);
  await loadCommands(client);
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
