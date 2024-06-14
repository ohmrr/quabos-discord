import { prisma } from '../..';

async function getChannelMessages(guildId: string) {
  const channels = await prisma.channel.findMany({
    where: {
      guildId: guildId,
    },
    include: {
      messages: true,
    },
  });

  const messages = channels.flatMap(channel => channel.messages);
  return messages;
}
