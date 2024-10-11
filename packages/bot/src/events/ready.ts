import { ActivityType } from 'discord.js';
import { createEvent } from '../interfaces/applicationEvent';
import deployCommands from '../handlers/deployCommands';
import { formatDate } from '../utils/date';

const ready = createEvent('ready', true, (prisma, client) => {
  const guildSize = client.guilds.cache.size;
  const currentDate = formatDate(new Date());
  const wordArt = `   ____              __              
  / __ \\__  ______ _/ /_  ____  _____
 / / / / / / / __ \`/ __ \\/ __ \\/ ___/
/ /_/ / /_/ / /_/ / /_/ / /_/ (__  ) 
\\___\\_\\__,_/\\__,_/_.___/\\____/____/\n\n`;

  console.log(wordArt);
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
