import { PrismaClient } from '@prisma/client';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import packageJson from '../../package.json' assert { type: 'json' };

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  allowedMentions: {
    repliedUser: true,
    parse: ['roles', 'users'],
  },
  partials: [Partials.Message, Partials.GuildMember, Partials.Channel],
  failIfNotExists: false,
});

client.version = `v${packageJson.version}`;
client.cooldowns = new Collection();
client.inactivityTriggers = new Collection();

export const prisma = new PrismaClient();
