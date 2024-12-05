import { ChannelType } from 'discord.js';
import { prisma } from '..';
import { createEvent } from '../interfaces/applicationEvent';
import logger from '../utils/logger';

const channelDelete = createEvent('channelDelete', false, async channel => {
  if (channel.type !== ChannelType.GuildText) return;
  if (!channel.guild) return;

  const { id } = channel;

  const existingTrackedChannel = await prisma.channel.findUnique({
    where: { id },
  });

  if (!existingTrackedChannel) return;

  try {
    await prisma.channel.delete({
      where: { id: existingTrackedChannel.id },
    });
  } catch (error) {
    logger.error({ id, error }, 'Error deleting channel record from database.');
  }
});

export default channelDelete;
