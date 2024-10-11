import { REST, Routes, Client } from 'discord.js';

async function deployCommands(client: Client) {
  if (!client.user) {
    console.error('Client missing user properties, cancelling command deployment.');
    return;
  }

  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  const commandsData = client.commands.map(command => command.data.toJSON());

  const route =
    process.env.NODE_ENV === 'production' ?
      Routes.applicationCommands(client.user.id)
    : Routes.applicationGuildCommands(client.user.id, process.env.DEV_GUILD_ID);

  try {
    await rest.put(route, { body: [] });
    console.log(
      `Application (/) commands successfully refreshed to ${process.env.NODE_ENV}.`,
    );

    await rest.put(route, { body: commandsData });
    console.log(
      `Application (/) commands successfully registered to ${process.env.NODE_ENV}.`,
    );
  } catch (error) {
    console.error(`Error registering (/) commands: ${error}`);
  }
}

export default deployCommands;
