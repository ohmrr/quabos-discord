import { createEvent } from '../interfaces/applicationEvent';

const interactionCreate = createEvent(
  'interactionCreate',
  false,
  async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
  },
);

export default interactionCreate;
