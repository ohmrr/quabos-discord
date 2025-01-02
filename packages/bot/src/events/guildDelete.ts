import { prisma } from '../utils/client';
import { createEvent } from '../interfaces/applicationEvent';
import logger from '../utils/logger';

const guildDelete = createEvent('guildDelete', false, async guild => {
  const { id } = guild;

  try {
    await prisma.guild.delete({ where: { id } });
  } catch (error) {
    logger.error({ id, error }, 'Error deleting guild record from database.');
  }
});

export default guildDelete;
