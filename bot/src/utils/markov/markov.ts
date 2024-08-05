import { Message } from 'discord.js';
import { prisma } from '../..';

export function isValidMessage(message: Message): boolean {
  const startsWithCommandChar = /^[!\/?]/i;
  if (
    startsWithCommandChar.test(message.content) ||
    message.content.split(' ').length < 2
  )
    return false;

  return true;
}

export async function getGuildMessages(guildId: string) {
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

export async function generateResponse(guildId: string) {
  const messages = await getGuildMessages(guildId);
}
