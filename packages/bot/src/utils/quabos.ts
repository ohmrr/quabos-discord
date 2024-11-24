import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
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

client.version = `v${version}`;
client.cooldowns = new Collection();

export { client };
