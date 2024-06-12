import { createEvent } from '../interfaces/applicationEvent';
import emojiMap from '../utils/emojiMap';

const interactionCreate = createEvent(
  'interactionCreate',
  false,
  async (prisma, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

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
