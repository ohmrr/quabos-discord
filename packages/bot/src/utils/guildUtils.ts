import { prisma } from '../..';

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
