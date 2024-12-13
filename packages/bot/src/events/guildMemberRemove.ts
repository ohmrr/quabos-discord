import { prisma } from '..';
import { createEvent } from '../interfaces/applicationEvent';
import logger from '../utils/logger';

const guildMemberRemove = createEvent('guildMemberRemove', false, async member => {
  const { id } = member;
  const guildId = member.guild.id;

  try {
    await prisma.guildMember.delete({
      where: {
        id_guildId: {
          id,
          guildId,
        },
      },
    });
  } catch (error) {
    logger.error(
      error,
      'Error fetching guild member for guildMemberRemove event or member did not exist.',
    );
  }
});

export default guildMemberRemove;
