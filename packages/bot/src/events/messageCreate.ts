import { prisma } from '..';
import { createEvent } from '../interfaces/applicationEvent';
import emojiMap from '../utils/emojiMap';
import logger from '../utils/logger';
import { generateResponse, saveMessage } from '../utils/markov';

const messageCreate = createEvent('messageCreate', false, async message => {
  if (!message.guild || !message.channel) return;

  await saveMessage(message);

  if (message.author.bot || message.author.system) return;
  const guildId = message.guild.id;
  const guildRecord = await prisma.guild.findUnique({
    where: { guildId },
    select: { probability: true },
  });

  if (!guildRecord) return;

  const shouldRespond = Math.random() < guildRecord.probability;
  if (!shouldRespond) return;

  const response = await generateResponse(guildId);
  if (!response) return;

  const emojiList = Array.from(Object.values(emojiMap.celestial));
  const randomIndex = Math.floor(Math.random() * emojiList.length);

  try {
    await message.channel.sendTyping();
    await new Promise(resolve => setTimeout(resolve, 5000));
    await message.channel.send(`${emojiList[randomIndex]} ${response}`);
  } catch (error) {
    logger.error(error, 'Error sending randomly generated message');
  }
});

export default messageCreate;
