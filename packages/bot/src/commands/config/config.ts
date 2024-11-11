import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import type Command from '../../interfaces/command';
import emojiMap from '../../utils/emojiMap';
import add from './channels/add';
import list from './channels/list';
import remove from './channels/remove';
import set from './probability/set';
import view from './probability/view';
import resetlog from './resetlog';

export default {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Manage bot configuration.')
    .setContexts(InteractionContextType.Guild)
    .addSubcommandGroup(channels =>
      channels
        .setName('channels')
        .setDescription('Manage channel settings for Quabos.')
        .addSubcommand(add.data)
        .addSubcommand(list.data)
        .addSubcommand(remove.data),
    )
    .addSubcommandGroup(probability =>
      probability
        .setName('probability')
        .setDescription('Manage probability settings for Quabos.')
        .addSubcommand(set.data)
        .addSubcommand(view.data),
    )
    .addSubcommand(resetlog.data),
  subcommands: {
    add,
    list,
    remove,
    set,
    view,
    resetlog,
  },
  usage: `${add.usage}\n${remove.usage}\n${list.usage}\n${resetlog.usage}`,
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
      case 'add':
        await add.execute(interaction);
        break;
      case 'list':
        await list.execute(interaction);
        break;
      case 'remove':
        await remove.execute(interaction);
        break;
      case 'set':
        await set.execute(interaction);
        break;
      case 'view':
        await view.execute(interaction);
        break;
      case 'resetlog':
        await resetlog.execute(interaction);
        break;
      default:
        await interaction.reply({
          content: `${emojiMap.error.denied} Subcommand not found.`,
          ephemeral: true,
        });
        break;
    }
  },
} satisfies Command;
