import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import type Command from '../../interfaces/command';
import emojiMap from '../../utils/emojiMap';
import optin from './optin';
import optout from './optout';

export default {
  data: new SlashCommandBuilder()
    .setName('privacy')
    .setDescription(
      'Allows you to opt-in or opt-out of message collection either globally or locally.',
    )
    .setContexts(InteractionContextType.Guild)
    .addSubcommand(optin.data)
    .addSubcommand(optout.data),
  subcommands: {
    optin,
    optout,
  },
  usage: `${optin.usage}\n${optout.usage}`,
  execute: async interaction => {
    if (!interaction.guild) return;

    const subcommand = interaction.options.getSubcommand();
    if (!subcommand) {
      await interaction.reply({
        content: `${emojiMap.error.cross} Error getting the subcommand.`,
        ephemeral: true,
      });
      return;
    }

    switch (subcommand) {
      case 'opt-in':
        await optin.execute(interaction);
        break;

      case 'opt-out':
        await optout.execute(interaction);
        break;

      default:
        await interaction.reply({
          content: `${emojiMap.error.cross} Error executing or finding the subcommand.`,
          ephemeral: true,
        });
        break;
    }
  },
} satisfies Command;
