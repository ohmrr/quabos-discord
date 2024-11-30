import type {
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  MessagePayload,
} from 'discord.js';
import logger from './logger';

export default async function safeReply(
  interaction: ChatInputCommandInteraction,
  options: string | MessagePayload | InteractionReplyOptions,
) {
  try {
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(options);
    } else {
      await interaction.reply(options);
    }
  } catch (error) {
    logger.error(error, 'Unable to safely reply to interaction.');
  }
}
