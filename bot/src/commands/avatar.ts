import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Command from '../interfaces/command';

const avatar: Command = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Display the avatar of the selected server member.')
    .setDMPermission(false)
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('A user in the current server.')
        .setRequired(false),
    ),
  usage: '/avatar [user]',
  execute: async interaction => {
    if (!interaction.guild) return;

    const user = interaction.options.getUser('user', false) ?? interaction.user;
    const avatarEmbed = new EmbedBuilder({
      author: {
        name: user.username,
        iconURL: user.displayAvatarURL({ size: 4096 }),
      },
      thumbnail: {
        url: user.displayAvatarURL({ size: 4096 }),
      },
      timestamp: Date.now(),
    });

    interaction.reply({ embeds: [avatarEmbed] });
  },
};

export default avatar;
