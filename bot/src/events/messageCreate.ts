import { createEvent } from '../interfaces/applicationEvent';
import { isValidMessage } from '../utils/markov/markovUtils';

const messageCreate = createEvent(
  'messageCreate',
  false,
  async (prisma, message) => {
    if (!message.guild || !message.channel) return;
    if (message.author.bot || message.system) return;
    if (!isValidMessage(message)) return;

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
