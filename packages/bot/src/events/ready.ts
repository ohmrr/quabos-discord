import { ActivityType } from 'discord.js';
import deployCommands from '../handlers/deployCommands';
import { createEvent } from '../interfaces/applicationEvent';
import logger from '../utils/logger';

const ready = createEvent('ready', false, async client => {
  const guildSize = client.guilds.cache.size;
  const wordArt = `   ____              __              
  / __ \\__  ______ _/ /_  ____  _____
 / / / / / / / __ \`/ __ \\/ __ \\/ ___/
/ /_/ / /_/ / /_/ / /_/ / /_/ (__  ) 
\\___\\_\\__,_/\\__,_/_.___/\\____/____/\n`;

  logger.info(`\n${wordArt}`);
  logger.info(`Logged in as ${client.user.tag} in ${client.guilds.cache.size} servers.`);

  client.user.setPresence({
    status: 'online',
    activities: [
      {
        type: ActivityType.Watching,
        name: `${guildSize} servers`,
      },
    ],
  });

  await deployCommands(client);
});

export default ready;
