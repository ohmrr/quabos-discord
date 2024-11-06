import { prisma } from '..';
import { createEvent } from '../interfaces/applicationEvent';
import logger from '../utils/logger';

const guildDelete = createEvent('guildDelete', false, async guild => {
  const guildId = guild.id;

  try {
    await prisma.guild.delete({ where: { guildId } });
  } catch (error) {
    logger.error({ guildId, error }, 'Error deleting guild record from database')
  }
});

export default guildDelete;
