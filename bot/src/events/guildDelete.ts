import { createEvent } from '../interfaces/applicationEvent';

const guildDelete = createEvent('guildDelete', false, async (prisma, guild) => {
  try {
    await prisma.guild.delete({ where: { guildId: guild.id } });
  } catch (error) {
    console.error(`Error while deleting guild record [ID: ${guild.id}]: `, error);
  }
});

export default guildDelete;
