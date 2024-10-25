import { prisma } from '../..';
import { Guild, PermissionsBitField, TextChannel } from 'discord.js';

export async function checkAndUpdateGuildRecord(guildId: string, guildName: string, channelId: string) {
  const existingGuild = await prisma.guild.findUnique({
    where: { guildId },
    include: { trackedChannels: true },
  });

  if (!existingGuild) {
    await prisma.guild.create({
      data: {
        guildId,
        name: guildName,
        trackedChannels: {
          create: { channelId },
        },
      },
    });
  } else {
    await prisma.guild.update({
      where: { guildId },
      data: {
        trackedChannels: {
          create: { channelId },
        },
      },
    });
  }
}

export async function checkAndDeleteChannelRecord(guildId: string, channelId: string) {
  const existingGuild = await prisma.guild.findUnique({
    where: { guildId },
    include: { trackedChannels: true },
  });

  if (existingGuild) {
    await prisma.trackedChannel.deleteMany({
      where: {
        guildId,
        channelId,
      },
    });
  }
}

export function botHasReadPermission(guild: Guild, channelId: string): boolean {
  const channel = guild.channels.cache.get(channelId) as TextChannel;
  if (!channel) return false;

  const botMember = guild.members.me;
  if (!botMember) return false;

  return channel.permissionsFor(botMember).has(PermissionsBitField.Flags.ViewChannel);
}
