import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { getRandomEmoji } from "./emojiMap";
import logger from "./logger";
import { generateResponse } from "./markov";

export default async function inactivityResponse(message: OmitPartialGroupDMChannel<Message<boolean>>, msThreshold: number) {
  if (!message.guild) return;
  const guildId = message.guild.id;

  const response = await generateResponse(guildId);
  if (!response) return;

  const emoji = getRandomEmoji();

  try {
    await message.channel.sendTyping();
    await new Promise(resolve => setTimeout(resolve, 5000));
    await message.channel.send(`${emoji} ${response}`);
  } catch (error) {
    logger.error(error, 'Error sending randomly generated message for inactivity trigger.')
  }
}