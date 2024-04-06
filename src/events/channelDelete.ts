import { ChannelType } from 'discord.js';
import { createEvent } from '../interfaces/applicationEvent';

const channelDelete = createEvent('channelDelete', false, async (prisma, channel) => {
  if (channel.type !== ChannelType.GuildText || !channel.guild) return;

  await prisma.channel.delete({ where: { channelId: channel.id } });
});
