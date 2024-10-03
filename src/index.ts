import { PrismaClient } from '@prisma/client';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import 'dotenv/config';
import { version } from '../package.json';
import loadCommands from './utils/handlers/loadCommands';
import loadEvents from './utils/handlers/loadEvents';

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],

  partials: [Partials.Message, Partials.Channel],

  allowedMentions: {
    parse: ['users'],
  },
});

const prisma = new PrismaClient();
const clientVersion = version;

async function init() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully!');

    await loadEvents(client);
    await loadCommands(client);
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('Error initializing client:', error);
    process.exit(1);
  }
}

init().finally(async () => {
  await prisma.$disconnect();
});

export { clientVersion, prisma };
