import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import type Subcommand from '../../interfaces/subcommand';
import emojiMap from '../../utils/emojiMap';
import logger from '../../utils/logger';

export default {
  data: new SlashCommandSubcommandBuilder()
    .setName('invite')
    .setDescription(
      'Links to invite Quabos to your server and to join the support server.',
    ),
  usage: '/info invite',
  execute: async interaction => {
    const inviteButton = new ButtonBuilder()
      .setLabel(`${emojiMap.alien} Invite Quabos to your Server`)
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/oauth2/authorize?client_id=942251323741569024');

    const supportButton = new ButtonBuilder()
      .setLabel(`${emojiMap.link} Join Support Server`)
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.gg/EfYdnVMK');

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
      inviteButton,
      supportButton,
    ]);

    const inviteEmbed = new EmbedBuilder()
      .setTitle('Quabos Links')
      .setDescription('Below are all of the links for Quabos.');

    try {
      await interaction.reply({ embeds: [inviteEmbed], components: [buttonRow] });
    } catch (error) {
      logger.error(error, 'Error sending invite embed and button row.');
      await interaction.reply({
        content: `${emojiMap.error} There was an error sending the invite. Please try again later.`,
        ephemeral: true,
      });
    }
  },
} satisfies Subcommand;
