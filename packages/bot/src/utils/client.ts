import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { version } from '../../package.json';

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
client.inactivityTriggers = new Collection();

export { client, prisma };
