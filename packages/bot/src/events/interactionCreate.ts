import { ChatInputCommandInteraction, Collection, PermissionsBitField } from 'discord.js';
import { createEvent } from '../interfaces/applicationEvent';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';
import hasPermissions from '../utils/hasPermissions';
import logger from '../utils/logger';

const interactionCreate = createEvent('interactionCreate', false, async interaction => {
  let command: Command | undefined;

  if (interaction.isChatInputCommand()) {
    command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    const hasCooldown = await handleCooldown(interaction, command);
    if (hasCooldown) return;

    const { canExecute, missingPermissions } = hasPermissions(interaction, command);
    if (!canExecute && missingPermissions) {
      const missingPermissionNames = missingPermissions
        .map(permission => new PermissionsBitField(permission).toArray())
        .flat()
        .join(', ');

      await interaction.reply({
        content: `${emojiMap.error} You are missing the following permissions: ${missingPermissionNames}`,
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error(
        { commandName: command.data.name, error },
        'Unable to execute slash command.',
      );
      await interaction.reply({
        content: `${emojiMap.error} There was an error executing the command. Please try again later.`,
        ephemeral: true,
      });
    }

    return;
  }

  if (interaction.isAutocomplete()) {
    command = interaction.client.commands.get(interaction.commandName);
    if (!command || !command.autocomplete) return;

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      logger.error(
        { commandName: command.data.name, error },
        'Unable to execute autocomplete command.',
      );
    }

    return;
  }
});

async function handleCooldown(interaction: ChatInputCommandInteraction, command: Command) {
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

export default interactionCreate;
