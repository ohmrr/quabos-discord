import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Command from '../interfaces/command';

const serverInfo: Command = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('a')
    .setDMPermission(false),
  execute: async interaction => {
    if (!interaction.guild) return;
    const { guild } = interaction;

    const guildIcon = guild.iconURL({ size: 4096 }) || '';

    const serverInfoEmbed = new EmbedBuilder({
      author: {
        name: guild.name,
        iconURL: guildIcon,
      },
      thumbnail: { url: guildIcon },
      description: guild.name,

      footer: {
        text: `ID: ${guild.id}`,
      },
      timestamp: Date.now(),
    });

    interaction.reply({ embeds: [serverInfoEmbed] });
  },
};

export default serverInfo;
