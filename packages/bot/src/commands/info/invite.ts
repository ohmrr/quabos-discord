import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandSubcommandBuilder
} from 'discord.js';
import Subcommand from '../../interfaces/subcommand';
import emojiMap from '../../utils/emojiMap';
import logger from '../../utils/logger';

export default {
  data: new SlashCommandSubcommandBuilder()
    .setName('invite')
    .setDescription('Send an invite to have Quabos join another server.'),
  usage: '/info invite',
  execute: async interaction => {
    const inviteButton = new ButtonBuilder()
      .setLabel('Invite')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/oauth2/authorize?client_id=942251323741569024');

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(inviteButton);

    const inviteEmbed = new EmbedBuilder()
      .setTitle('Quabos Links')
      .setDescription('Below are all of the links for Quabos.');

    try {
      await interaction.reply({ embeds: [inviteEmbed], components: [buttonRow] });
    } catch (error) {
      logger.error(error, 'Error sending invite embed and button row.');
      await interaction.reply(
        `${emojiMap.error} There was an error sending the invite. Please try again later.`,
      );
    }
  },
} satisfies Subcommand;
