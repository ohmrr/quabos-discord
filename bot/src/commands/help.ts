import {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
} from 'discord.js';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

const help: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows command information.')
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
    .addStringOption(command =>
      command
        .setName('command')
        .setDescription('The command to get help for.')
        .setRequired(false)
        .setAutocomplete(true),
    ),
  usage: '/help [command]',
  execute: async interaction => {
    if (!interaction.guild) return;

    const client = interaction.client;
    const clientAvatar = client.user.avatarURL({ size: 4096 }) || '';
    const commandChoice = interaction.options
      .getString('command', false)
      ?.toLowerCase();

    let helpEmbed;

    if (
      !commandChoice ||
      commandChoice === 'help' ||
      !client.commands.has(commandChoice)
    ) {
      helpEmbed = new EmbedBuilder({
        author: {
          name: client.user.tag,
          iconURL: clientAvatar,
        },
        thumbnail: {
          url: clientAvatar,
        },
        description:
          `**${client.user.username} can learn from messages sent in your server and generate new ones based off of what was said.**\n\n` +
          'You can start by typing: `/watch [channel]` and as more messages are collected, run `/serverinfo` to check how many were collected.',
      });

      await interaction.reply({ embeds: [helpEmbed] });
      return;
    }

    const command = client.commands.get(commandChoice);
    if (!command) {
      await interaction.reply(`${emojiMap.error.cross} Error finding command.`);
      console.error(`Error providing help for command ${commandChoice}: ${command}`);
      return;
    }

    helpEmbed = new EmbedBuilder({
      author: {
        name: client.user.username,
        iconURL: clientAvatar,
      },
      title: `Command: /${commandChoice}`,
      description: `**Description**: ${command.data.description}\n\n**Usage**: ${command.usage}`,
    });

    await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
  },
  autocomplete: async interaction => {
    const focusedValue = interaction.options.getFocused();

    const filteredCommands = interaction.client.commands
      .filter(command => command.data.name.startsWith(focusedValue))
      .map(command => ({ name: command.data.name, value: command.data.name }));

    await interaction.respond(filteredCommands);
  },
};

export default help;
