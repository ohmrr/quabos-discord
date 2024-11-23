import { Client, REST, Routes } from 'discord.js';
import logger from '../utils/logger';
import { client } from '../utils/quabos';

async function deployCommands() {
  if (!client.user) {
    logger.error('Client missing user properties, cancelling command deployment.');
    process.exit(1);
  }

  if (!process.env.NODE_ENV) {
    logger.error('Missing environment variable: NODE_ENV.');
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'development' && !process.env.DEV_GUILD_ID) {
    logger.error('Missing environment variable: DEV_GUILD_ID.');
    process.exit(1);
  }

  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  const commandsData = client.commands.map(command => command.data.toJSON());

  const route =
    process.env.NODE_ENV === 'production'
      ? Routes.applicationCommands(client.user.id)
      : Routes.applicationGuildCommands(client.user.id, process.env.DEV_GUILD_ID);

  try {
    await rest.put(route, { body: commandsData });

    logger.info(
      `Application (/) commands successfully registered to ${process.env.NODE_ENV}.`,
    );
  } catch (error) {
    logger.error(
      error,
      `Error registering application (/) commands to ${process.env.NODE_ENV}`,
    );
    process.exit(1);
  }
}

export default deployCommands;
