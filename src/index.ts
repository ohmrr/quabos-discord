import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { createEvent } from './interfaces/ApplicationEvents';
import { readdirSync } from 'fs';
import path from 'path';
import 'dotenv/config';

const client = new Client({
	intents: [
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
	],

	partials: [Partials.Message, Partials.Message],

	allowedMentions: {
		parse: ['users'],
	},
});

const eventFolderPath = path.join(__dirname, 'events');
const eventFiles = readdirSync(eventFolderPath).filter(file => file.endsWith('.js'));
eventFiles.forEach(async file => {
	try {
		const eventModule = (await import(`${eventFolderPath}/${file}`)).default;

		if (!eventModule.name || !eventModule.execute) {
			console.log(
				`${eventFolderPath}/${file} is missing properties. Skipping onto the next file...`,
			);

			return;
		}

		const event = createEvent(
			eventModule.name,
			eventModule.once,
			eventModule.execute,
		);

		if (event.once) {
			client.once(event.name, (...params) => event.execute(...params));
		} else {
			client.on(event.name, (...params) => event.execute(...params));
		}
	} catch (err) {
		console.error(`Error loading in ${eventFolderPath}/${file}: `, err);
	}
});

client.login(process.env.DISCORD_TOKEN);
