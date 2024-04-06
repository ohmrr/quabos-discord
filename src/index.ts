import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { loadCommands } from './utils/loadCommands';
import { PrismaClient } from '@prisma/client';
import loadEvents from './utils/loadEvents';
import 'dotenv/config';

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
  ],

  partials: [Partials.Message, Partials.Channel],

  allowedMentions: {
    parse: ['users'],
  },
});

const prisma = new PrismaClient();

const init = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
  
  loadEvents(prisma, client);
  loadCommands(client);

  client.login(process.env.DISCORD_TOKEN);
};

init().finally(async () => {
  await prisma.$disconnect();
});
