import { createEvent } from '../interfaces/applicationEvent';

const messageCreate = createEvent(
  'messageCreate',
  false,
  async (prisma, message) => {
    if (!message.guild || !message.channel) return;
    if (message.author.bot || message.system) return;

    const startsWithCommandCharacter = /^[!\/?]/i;
    if (startsWithCommandCharacter.test(message.content)) return;
    if (message.content.split(' ').length < 2) return;

    const isWatchChannel = await prisma.channel.findUnique({
      where: { channelId: message.channelId },
    });
    if (!isWatchChannel) return;

    await prisma.message.create({
      data: {
        content: message.content,
        messageId: message.id,
        channel: {
          connect: { id: isWatchChannel.id },
        },
      },
    });
  },
);

export default messageCreate;
