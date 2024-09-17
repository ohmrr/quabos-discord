import MarkovMachine from 'markov-strings';
import { Message } from 'discord.js';
import { prisma } from '../..';
import emojiMap from '../emojiMap';

export function isValidMessage(message: Message): boolean {
  const startsWithCommandChar = /^[!\/?]/i;
  if (
    startsWithCommandChar.test(message.content) ||
    message.content.split(' ').length < 2
  )
    return false;

  return true;
}

export async function saveMessage(message: Message) {
  const isWatchChannel = await prisma.channel.findUnique({
    where: { channelId: message.channel.id },
  });

  if (!isWatchChannel || !isValidMessage(message)) return;

  await prisma.message.create({
    data: {
      content: message.content,
      messageId: message.id,
      channel: {
        connect: {
          channelId: isWatchChannel.channelId
        },
      },
    },
  });

}

export async function getGuildMessages(guildId: string) {
  try {
    const guild = await prisma.guild.findUnique({
      where: {
        guildId: guildId,
      },
      include: { watchChannels: { include: { messages: true } } },
    });

    if (!guild) {
      return null;
    }

    const messages = guild.watchChannels
      .flatMap(channel => channel.messages)
      .map(message => message.content);
    return messages;
  } catch (error) {
    console.error('Error fetching guild messages: ', error);
    return null;
  }
}

export async function generateResponse(guildId: string) {
  const messages = await getGuildMessages(guildId);
  if (!messages) return;

  try {
    const markov = new MarkovMachine({ stateSize: 2 });
    markov.addData(messages);

    const result = markov.generate({
      maxTries: 100,
      filter: result => result.string.split(' ').length >= 4,
    });

    return result.string;
  } catch (error) {
    return null;
  }
}
