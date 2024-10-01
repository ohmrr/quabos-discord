import { createEvent } from '../interfaces/applicationEvent';
import emojiMap from '../utils/emojiMap';

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

    const blacklistedIds = process.env.BLACKLISTED_IDS.split(',');
    const isBlacklisted = blacklistedIds.includes(interaction.user.id);

    if (isBlacklisted) {
      interaction.reply(
        `${emojiMap.error.denied} You are currently blacklisted. Please contact the developers for more information.`,
      );

      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Slash command error:\n\n${error}`);
      await interaction.reply({
        content: `${emojiMap.error.cross} There was an error while executing this command.`,
        ephemeral: true,
      });
    }
  },
);

export default interactionCreate;
