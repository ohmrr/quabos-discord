import { PrismaClient } from '@prisma/client';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
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
const clientVersion = version;

async function init() {
  try {
    await prisma.$connect();

    await loadEvents(client);
    await loadCommands(client);
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    logger.fatal(error, 'Unable to initialize database and client.');
    process.exit(1);
  }
}

init().finally(async () => {
  await prisma.$disconnect();
});

client.login(process.env.DISCORD_TOKEN);

export { clientVersion, prisma };
