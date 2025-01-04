import { Message, OmitPartialGroupDMChannel } from 'discord.js';
import logger from './logger';
import { getRandomEmoji } from './emojiMap';
import { generateResponse } from './markov';

export default async function inactivityResponse(
  message: OmitPartialGroupDMChannel<Message<boolean>>
) {
  if (!message.guild) return;

  const guildId = message.guild.id;
  const emoji = getRandomEmoji();
  const response = await generateResponse(guildId);
  if (!response) return;

  try {
    await message.channel.send(`${emoji} ${response}`);
  } catch (error) {
    logger.error(error, 'Error sending inactivity trigger response message.');
  }
}
