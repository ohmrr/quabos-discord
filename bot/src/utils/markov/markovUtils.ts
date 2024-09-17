import MarkovMachine  from 'markov-strings';
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

  const messages = channels.flatMap(channel => channel.messages).map(message => message.content);
  return messages;
}

export async function generateResponse(guildId: string) {
  const messages = await getGuildMessages(guildId);
  if (messages.length === 0) return null;

  const markov = new MarkovMachine({ stateSize: 2 });
  markov.addData(messages);

  const result = await markov.generate({
    maxTries: 100,
    filter: (result) => result.string.split(' ').length >= 4
  });

  return result.string;
}
