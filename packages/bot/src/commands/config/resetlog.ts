import {
  SlashCommandSubcommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  PermissionsBitField,
} from 'discord.js';
import Subcommand from '../../interfaces/subcommand';
import { prisma } from '../..';
import emojiMap from '../../utils/emojiMap';

const resetlog: Subcommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('reset-log')
    .setDescription('Deletes all the message logs for your server.'),
  permissions: new PermissionsBitField(PermissionsBitField.Flags.ManageGuild),
  usage: '/config reset-log',
  execute: async interaction => {
    if (!interaction.guild) return;

    const guildId = interaction.guild.id;
    const guildRecord = await prisma.guild.findUnique({
      where: { guildId },
      include: { messages: true },
    });

    if (!guildRecord || guildRecord.messages.length === 0) {
      await interaction.reply(
        `${emojiMap.error.cross} There are currently no messages stored.`,
      );
      return;
    }

    const confirmButton = new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel('Confirm')
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary);

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      confirmButton,
      cancelButton,
    );

    const deleteLogEmbed = new EmbedBuilder().setDescription(
      `**Are you sure you want to continue?**
      
      There are currently ${guildRecord.messages.length} stored. Press confirm to continue. You will not be able to undo this action.`,
    );

    const cancelEmbed = new EmbedBuilder().setDescription(
      `Deletion of message logs has been cancelled.`,
    );

    const reply = await interaction.reply({
      embeds: [deleteLogEmbed],
      components: [buttonRow],
    });

    const filter = (i: any) => i.user.id === interaction.user.id;
    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000,
      filter,
    });

    collector.on('collect', async i => {
      if (i.customId === 'confirm') {
        await prisma.message.deleteMany({ where: { guildId } });

        const confirmEmbed = new EmbedBuilder().setDescription(
          `${emojiMap.success.check} All the message logs have been deleted.`,
        );
        await i.update({ embeds: [confirmEmbed], components: [] });
      } else if (i.customId === 'cancel') {
        await i.update({ embeds: [cancelEmbed], components: [] });
      }
    });

    collector.on('end', async collected => {
      if (collected.size === 0) {
        interaction.editReply({ embeds: [cancelEmbed], components: [] });
      }
    });
  },
};

export default resetlog;
