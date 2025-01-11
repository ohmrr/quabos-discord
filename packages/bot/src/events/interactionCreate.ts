import { PermissionsBitField } from 'discord.js';
import { createEvent } from '../interfaces/applicationEvent';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';
import handleCooldown from '../utils/handleCooldown';
import logger from '../utils/logger';
import { userPermissions } from '../utils/permissions';

const interactionCreate = createEvent('interactionCreate', false, async interaction => {
  let command: Command | undefined;

  if (interaction.isChatInputCommand()) {
    command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    const hasCooldown = await handleCooldown(interaction, command);
    if (hasCooldown) return;

    const { canExecute, missingPermissions } = userPermissions(interaction, command);
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

export default interactionCreate;
