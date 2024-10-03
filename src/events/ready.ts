import { ActivityType } from 'discord.js';
import { createEvent } from '../interfaces/applicationEvent';
import deployCommands from '../utils/handlers/deployCommands';
import { formatDate } from '../utils/timestamp';

const ready = createEvent('ready', true, (prisma, client) => {
  const guildSize = client.guilds.cache.size;
  const currentDate = formatDate(new Date());
  console.log(
    `${currentDate} | Logged in as ${client.user.tag} in ${client.guilds.cache.size} servers.`,
  );

  client.user.setPresence({
    status: 'online',
    activities: [
      {
        type: ActivityType.Watching,
        name: `${guildSize} servers`,
      },
    ],
  });

  deployCommands(client);
});

export default ready;
