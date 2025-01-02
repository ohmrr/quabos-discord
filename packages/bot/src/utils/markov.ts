import { Client, Collection, Message, type Snowflake, TextChannel } from 'discord.js';
import Markov from 'markov-strings';
import { prisma } from './client';
import logger from './logger';

function isValidMessage(message: Message): boolean {
  const startsWithCommandChar = /^[!\/?]/i;
  if (startsWithCommandChar.test(message.content) || message.content.split(' ').length < 2)
    return false;

  return true;
}

function normalizeString(content: string): string {
  return content
    .replace(/[^a-zA-Z0-9@#<>&*_~`\s]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export async function saveMessage(message: Message) {
  if (!isValidMessage(message) || !message.guild) return;

  const channelId = message.channel.id;
  const guildId = message.guild.id;
  const userId = message.author.id;

  const isTrackedChannel = await prisma.channel.findUnique({
    where: { id: channelId },
  });
  if (!isTrackedChannel) return;

  const messageAuthor = await prisma.user.findUnique({ where: { id: userId } });
  if (
    messageAuthor &&
    (messageAuthor.globalIgnored || messageAuthor.guildIgnoredIds.includes(guildId))
  ) {
    return;
  }

  const content = normalizeString(message.content);

  try {
    await prisma.message.create({
      data: {
        content: content,
        id: message.id,
        channel: {
          connect: {
            id: isTrackedChannel.id,
          },
        },
        guild: {
          connect: {
            id: guildId,
          },
        },
      },
    });
  } catch (error) {
    logger.error(error, 'Unable to save message to database.');
  }
}

async function getGuildMessages(guildId: string) {
  try {
    const guild = await prisma.guild.findUnique({
      where: {
        id: guildId,
      },
      include: { trackedChannels: { include: { messages: true } } },
    });

    if (!guild) {
      return null;
    }

    const messages = guild.trackedChannels
      .flatMap(channel => channel.messages)
      .map(message => message.content);

    return messages;
  } catch (error) {
    logger.error(error, 'Unable to fetch guild messages for message response generation.');
    return null;
  }
}

export async function generateResponse(guildId: string) {
  const messages = await getGuildMessages(guildId);
  if (!messages || messages.length < 50) return null;

  const markov = new Markov({ stateSize: 2 });

  try {
    markov.addData(messages);

    const result = markov.generate({
      maxTries: 25,
      filter: result => result.string.split(' ').length >= 5,
    });

    return result.string;
  } catch (error) {
    logger.error(error, 'There was an error generating a markov result.');
    return null;
  }
}

// For testing purposes only, use with development guild.
export async function gatherMessagesFromGuild(guildId: string, client: Client) {
  const devGuild = await prisma.guild.findUnique({
    where: { id: guildId },
    include: { trackedChannels: true },
  });

  if (!devGuild || !devGuild.trackedChannels) {
    logger.error('The specified development guild is not being watched.');
    return;
  }

  logger.debug(guildId, 'Starting message collection for the specified development guild.');
  for (const trackedChannel of devGuild.trackedChannels) {
    const channel = client.channels.cache.get(trackedChannel.id);
    const channelId = trackedChannel.id;
    if (!channel || !(channel instanceof TextChannel)) {
      logger.warn(channelId, 'Channel is not a text channel or is unavailable.');
      continue;
    }

    try {
      const allMessages = await fetchAllMessagesFromChannel(channel);
      logger.debug(
        { id: channelId, name: channel.name, messageCount: allMessages.length },
        `Fetched all messages from the specified channel.`,
      );

      logger.debug('Removing bot and system messages.');
      for (const message of allMessages) {
        if (message.author.bot || message.system) continue;

        await saveMessage(message);
      }
    } catch (error) {
      logger.error(error, `Error fetching messages from channel ${trackedChannel.id}`);
    }
  }
}

async function fetchAllMessagesFromChannel(channel: TextChannel): Promise<Message[]> {
  let allMessages: Message[] = [];
  let lastMessageId: string | null = null;
  let fetchedMessages: Collection<Snowflake, Message<true>>;

  do {
    const options = lastMessageId ? { limit: 100, before: lastMessageId } : { limit: 100 };

    fetchedMessages = await channel.messages.fetch(options);
    allMessages = allMessages.concat(Array.from(fetchedMessages.values()));

    lastMessageId = fetchedMessages.last()?.id ?? null;
  } while (fetchedMessages.size === 100);

  return allMessages;
}
