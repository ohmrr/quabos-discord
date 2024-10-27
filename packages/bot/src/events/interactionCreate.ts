import { PermissionsBitField } from 'discord.js';
import { createEvent } from '../interfaces/applicationEvent';
import emojiMap from '../utils/emojiMap';
import hasPermissions from '../utils/hasPermissions';

const interactionCreate = createEvent(
  'interactionCreate',
  false,
  async (prisma, interaction) => {
    if (!interaction.isChatInputCommand()) {
      if (!interaction.isAutocomplete()) return;

      const command = interaction.client.commands.get(interaction.commandName);
      if (!command || !command.autocomplete) return;

      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error(`Error handling autocomplete interaction: ${error}`);
      }

      return;
    }

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    const { canExecute, missingPermissions } = hasPermissions(interaction, command);
    if (!canExecute && missingPermissions) {
      const missingPermissionsNames = missingPermissions
        .map(perm => new PermissionsBitField(perm).toArray())
        .flat()
        .join(', ');

      await interaction.reply({
        content: `${emojiMap.error.denied} You are missing the following permissions: ${missingPermissionsNames}`,
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Slash command error: ${error}`);
      await interaction.reply({
        content: `${emojiMap.error.cross} There was an error while executing this command.`,
        ephemeral: true,
      });
    }
  },
);

export default interactionCreate;
