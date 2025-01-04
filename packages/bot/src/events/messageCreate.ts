import { createEvent } from '../interfaces/applicationEvent';
import { prisma } from '../utils/client';
import { getRandomEmoji } from '../utils/emojiMap';
import inactivityResponse from '../utils/inactivityResponse';
import logger from '../utils/logger';
import { generateResponse, saveMessage } from '../utils/markov';

const messageCreate = createEvent('messageCreate', false, async message => {
  if (!message.guild || !message.channel) return;
  if (message.author.bot || message.author.system) return;

  await saveMessage(message);

  const client = message.client;
  const guildId = message.guild.id;
  const guildRecord = await prisma.guild.findUnique({ where: { id: guildId } });

  if (!guildRecord) return;

  const { inactivityTriggers } = client;
  const existingTrigger = inactivityTriggers.get(guildId);
  if (existingTrigger) clearTimeout(existingTrigger.timeoutId);

  if (guildRecord.inactivityTrigger && guildRecord.inactivityThreshold) {
    const thresholdMilliseconds = guildRecord.inactivityThreshold * 60 * 1000;
    const timeoutId = setTimeout(async () => {
      await inactivityResponse(message);
      inactivityTriggers.delete(guildId);
    }, thresholdMilliseconds);

    inactivityTriggers.set(guildId, { timeoutId, timestamp: Date.now() });
  }

  const shouldRespond = Math.random() < guildRecord.probability;
  if (!shouldRespond) return;

  const emoji = getRandomEmoji();
  const response = await generateResponse(guildId);
  if (!response) return;

  try {
    await message.channel.sendTyping();
    await new Promise(resolve => setTimeout(resolve, 5000));
    await message.channel.send(`${emoji} ${response}`);
  } catch (error) {
    logger.error(error, 'Error sending randomly generated message');
  }
});

export default messageCreate;
