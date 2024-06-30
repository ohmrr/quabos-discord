import { prisma } from '../..';

async function getGuildMessages(guildId: string) {
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

async function generateResponse(guildId: string) {
  const messages = await getGuildMessages(guildId);
}
