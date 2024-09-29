import { ChannelType } from 'discord.js';
import { createEvent } from '../interfaces/applicationEvent';

const channelDelete = createEvent(
  'channelDelete',
  false,
  async (prisma, channel) => {
    if (channel.type != ChannelType.GuildText) return;
    if (!channel.guild) return;

    const existingWatchChannel = await prisma.channel.findUnique({
      where: { channelId: channel.id },
    });

    if (!existingWatchChannel) return;

    try {
      await prisma.channel.delete({ where: { channelId: existingWatchChannel.channelId } });
    } catch (error) {
      console.error(`Error deleting channel record [ID: ${existingWatchChannel.channelId}]: `, error);
    }
  },
);

export default channelDelete;
