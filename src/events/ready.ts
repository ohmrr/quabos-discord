import { ActivityType } from 'discord.js';
import { createEvent } from '../interfaces/ApplicationEvents';

const ready = createEvent('ready', true, client => {
	const currentDate = new Date().toLocaleString('en-US');
	const guildSize = client.guilds.cache.size;
	console.log(
		`${currentDate} | Logged in as ${client.user?.tag} in ${client.guilds.cache.size} servers.`,
	);

	client.user?.setPresence({
		status: 'online',
		activities: [
			{
				type: ActivityType.Watching,
				name: `${guildSize} servers`,
			},
		],
	});
});

export default ready;
