import { REST, Routes, Client } from 'discord.js';

const deployCommands = async (client: Client) => {
  if (!client.user) {
    console.log(`Client missing user properties, cancelling command deployment...`);
    return;
  }

  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  const commandsData = client.commands.map((command) => command.data.toJSON());

  try {
    if (process.env.NODE_ENV === 'production') {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: commandsData,
      });

      console.log('Application (/) commands successfully registered to all guilds.');
    } else {
      await rest.put(
        Routes.applicationGuildCommands(client.user.id, process.env.DEV_GUILD_ID),
        { body: commandsData },
      );

      console.log(
        'Application (/) commands successfully registered to development guild.',
      );
    }
  } catch (error) {
    console.error(`Error registering application (/) commands: ${error}`);
  }
};

export default deployCommands;
