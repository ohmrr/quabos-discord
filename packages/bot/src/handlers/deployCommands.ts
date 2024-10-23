import { REST, Routes, Client } from 'discord.js';

async function deployCommands(client: Client) {
  if (!client.user) {
    console.error('Client missing user properties, cancelling command deployment.');
    return;
  }

  if (!process.env.NODE_ENV) {
    console.error('Missing environment variable: NODE_ENV.');
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'development' && !process.env.DEV_GUILD_ID) {
    console.error('Missing environment variable: DEV_GUILD_ID.');
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

    console.log(
      `Application (/) commands successfully registered to ${process.env.NODE_ENV}.`,
    );
  } catch (err) {
    console.error(
      `Error registering application (/) commands to ${process.env.NODE_ENV}: ${err}`,
    );
    process.exit(1);
  }
}

export default deployCommands;
