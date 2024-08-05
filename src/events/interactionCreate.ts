import { createEvent } from '../interfaces/applicationEvent';
import emojiMap from '../utils/emojiMap';

const interactionCreate = createEvent(
  'interactionCreate',
  false,
  async (prisma, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    const blacklistedIds = process.env.BLACKLISTED_IDS.split(',');
    const isBlacklisted = blacklistedIds.includes(interaction.user.id);

    if (isBlacklisted) {
      interaction.reply(
        `${emojiMap.error} You are currently blacklisted. Please contact the developers for more information.`,
      );

      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error handling slash command execution: ${error}`);
      await interaction.reply({
        content: `${emojiMap.error} There was an error while executing this command. Please try again later.`,
        ephemeral: true,
      });
    }
  },
);

export default interactionCreate;
