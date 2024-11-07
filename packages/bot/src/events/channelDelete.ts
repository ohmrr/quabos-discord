import { ChannelType } from 'discord.js';
import { prisma } from '..';
import { createEvent } from '../interfaces/applicationEvent';
import logger from '../utils/logger';

const channelDelete = createEvent('channelDelete', false, async channel => {
  if (channel.type !== ChannelType.GuildText) return;
  if (!channel.guild) return;

  const channelId = channel.id;

  const existingTrackedChannel = await prisma.channel.findUnique({
    where: { channelId },
  });

  if (!existingTrackedChannel) return;

  try {
    await prisma.channel.delete({
      where: { channelId: existingTrackedChannel.channelId },
    });
  } catch (error) {
    logger.error({ channelId, error }, 'Error deleting channel record from database');
  }
});

export default channelDelete;
