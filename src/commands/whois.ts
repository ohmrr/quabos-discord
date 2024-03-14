import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Command from '../interfaces/command';
import moment from 'moment';

const whois: Command = {
  data: new SlashCommandBuilder()
    .setName('whois')
    .setDescription('Get user information.')
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('Guild member to get information about.')
        .setRequired(false),
    )
    .setDMPermission(false),
  execute: async (interaction) => {
    if (!interaction.guild) return;

    const user = interaction.options.getUser('member', false) ?? interaction.user;
    const guildMember = interaction.guild.members.cache.get(user.id);
    if (!guildMember) return;

    const memberRoles = guildMember.roles.cache
      .filter((role) => role.name !== '@everyone')
      .map((role) => `<@&${role.id}>`);

    const whoisEmbed = new EmbedBuilder({
      author: {
        name: user.username,
        iconURL: user.displayAvatarURL({ size: 4096 }),
      },
      thumbnail: { url: user.displayAvatarURL({ size: 4096 }) },
      description: `<@!${user.id}>`,
      fields: [
        {
          name: 'Joined',
          value: moment(guildMember.joinedAt).format('ddd, MMM D, YYYY h:mm A'),
          inline: true,
        },
        {
          name: 'Registered',
          value: moment(user.createdAt).format('ddd, MMM D, YYYY h:mm A'),
          inline: true,
        },
        {
          name: `Roles [${memberRoles.length}]`,
          value: memberRoles.join(' '),
          inline: false,
        },
      ],
      footer: {
        text: `ID: ${user.id}`,
      },
      timestamp: Date.now(),
    });

    interaction.reply({ embeds: [whoisEmbed] });
  },
};

export default whois;
