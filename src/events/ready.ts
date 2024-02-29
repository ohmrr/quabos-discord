import { ActivityType } from 'discord.js';
import { createEvent } from '../interfaces/ApplicationEvents';

const ready = createEvent('ready', true, client => {
	console.log(`${client.user?.tag} is ready!`);

	const guildSize = client.guilds.cache.size;

	client.user?.setPresence({ status: 'online' });
	client.user?.setActivity({
		type: ActivityType.Watching,
		name: `${guildSize} servers`,
	});
});

export default ready;
