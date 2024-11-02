import { ChannelType } from 'discord.js';
import { prisma } from '..';
import { createEvent } from '../interfaces/applicationEvent';

const channelDelete = createEvent('channelDelete', false, async channel => {
  if (channel.type !== ChannelType.GuildText) return;
  if (!channel.guild) return;

  const existingTrackedChannel = await prisma.channel.findUnique({
    where: { channelId: channel.id },
  });

  if (!existingTrackedChannel) return;

  try {
    await prisma.channel.delete({
      where: { channelId: existingTrackedChannel.channelId },
    });
  } catch (error) {
    console.error(
      `Error deleting channel record [ID: ${existingTrackedChannel.channelId}]: `,
      error,
    );
  }
});

export default channelDelete;
