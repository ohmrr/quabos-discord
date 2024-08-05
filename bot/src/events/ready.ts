import { createEvent } from '../interfaces/applicationEvent';
import deployCommands from '../utils/handlers/deployCommands';
import { ActivityType } from 'discord.js';
import moment from 'moment';

const ready = createEvent('ready', true, (prisma, client) => {
  const currentDate = moment(new Date()).format('ddd, MMM D, YYYY h:mm A');
  const guildSize = client.guilds.cache.size;
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
