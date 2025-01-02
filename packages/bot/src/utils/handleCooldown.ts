import Command from '../interfaces/command';
import { Collection, ChatInputCommandInteraction } from 'discord.js';
import emojiMap from './emojiMap';

export default async function handleCooldown(
  interaction: ChatInputCommandInteraction,
  command: Command,
) {
  const { cooldowns } = interaction.client;

  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const defaultCooldownAmount = 3_000;
  const cooldownAmount = command.cooldown ?? defaultCooldownAmount;

  if (!timestamps) return false;
  const fetchedTime = timestamps.get(interaction.user.id);

  if (fetchedTime) {
    const expiration = fetchedTime + cooldownAmount;

    if (now < expiration) {
      const timeLeft = Math.round((expiration - now) / 1_000);
      const msg =
        timeLeft === 0
          ? `Please wait, you are still on cooldown.`
          : `Please wait, you are still on cooldown for ${timeLeft} ${timeLeft === 1 ? 'second' : 'seconds'}.`;

      await interaction.reply({
        content: `${emojiMap.errorAlt} ${msg}`,
        ephemeral: true,
      });
      return true;
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => {
    timestamps.delete(interaction.user.id);
  }, cooldownAmount);

  return false;
}
