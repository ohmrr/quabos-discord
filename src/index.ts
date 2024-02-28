import { Client, GatewayIntentBits, Partials, Events } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { token } from '../settings.json';
// import 'dotenv/config';

const client = new Client({
	intents: [
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
	],

	partials: [Partials.Message, Partials.Message],
});

export interface ClientEvent {
	name: keyof typeof Events;
	once: boolean;
	execute: (...args: Events[keyof Events][]) => void;
}

const eventFolderPath = path.join(__dirname, 'events');
const eventFiles = readdirSync(eventFolderPath).filter(file => file.endsWith('.js'));
eventFiles.forEach(async file => {
	const eventModule = (await import(`${eventFolderPath}/${file}`)).default;
  const event = eventModule as ClientEvent;
  
	client.on(event.name, (...args) => event.execute(...args));
});

client.login(token);
