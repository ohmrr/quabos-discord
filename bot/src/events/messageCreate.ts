import { createEvent } from '../interfaces/applicationEvent';
import emojiMap from '../utils/emojiMap';
import { saveMessage, generateResponse } from '../utils/markov/markovUtils';

const messageCreate = createEvent(
  'messageCreate',
  false,
  async (prisma, message) => {
    if (!message.guild || !message.channel) return;
    if (message.author.bot || message.system) return;

    await saveMessage(message);

    const guildId = message.guild.id;
    const shouldRespond = Math.random() < 0.08;
    if (!shouldRespond) return;

    const response = await generateResponse(guildId);
    if (!response) return;

    try {
      await message.channel.sendTyping();
      await new Promise(resolve => setTimeout(resolve, 5000));
      await message.channel.send(`${emojiMap.alien} ${response}`);
    } catch (error) {
      console.error(`Message creation error:\n\n${error}`);
    }
  },
);

export default messageCreate;
