import { createEvent } from '../interfaces/applicationEvent';
import { prisma } from '..';

const guildDelete = createEvent('guildDelete', false, async guild => {
  try {
    await prisma.guild.delete({ where: { guildId: guild.id } });
  } catch (error) {
    console.error(`Error while deleting guild record [ID: ${guild.id}]: `, error);
  }
});

export default guildDelete;
