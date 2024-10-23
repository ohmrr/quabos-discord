import { createEvent } from '../interfaces/applicationEvent';
import { saveMessage, generateResponse } from '../utils/markov';
import emojiMap from '../utils/emojiMap';

const messageCreate = createEvent('messageCreate', false, async (prisma, message) => {
  if (!message.guild || !message.channel) return;

  await saveMessage(message);

  const guildId = message.guild.id;
  const guildRecord = await prisma.guild.findUnique({
    where: { guildId },
    select: { probability: true },
  });

  const shouldRespond = Math.random() < 0.08;
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
    console.error(`Message creation error: ${error}`);
  }
});

export default messageCreate;
