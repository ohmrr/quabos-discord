import {
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import Command from '../../interfaces/command';
import emojiMap from '../../utils/emojiMap';
import add from './channels/add';
import list from './channels/list';
import remove from './channels/remove';

const config: Command = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Manage bot configuration.')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommandGroup(channels =>
      channels
        .setName('channels')
        .setDescription('Manage channel settings for Quabos.')
        .addSubcommand(add.data)
        .addSubcommand(list.data)
        .addSubcommand(remove.data),
    ),
  execute: async interaction => {
    if (!interaction.guild) return;

    const commandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();
    if (!commandGroup || !subcommand) {
      interaction.reply(
        `${emojiMap.error.denied} Error getting the command group or subcommand.`,
      );
      return;
    }

    switch (commandGroup) {
      case 'channels':
        switch (subcommand) {
          case 'add':
            await add.execute(interaction);
            break;
          case 'list':
            await list.execute(interaction);
            break;
          case 'remove':
            await remove.execute(interaction);
            break;
          default:
            await interaction.reply(
              `${emojiMap.error.denied} Subcommand not found.`,
            );
            break;
        }
        break;

      default:
        await interaction.reply(`${emojiMap.error.denied} Command group not found.`);
        break;
    }
  },
};

export default config;
