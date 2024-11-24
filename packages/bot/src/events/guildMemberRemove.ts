import { prisma } from '..';
import { createEvent } from '../interfaces/applicationEvent';
import logger from '../utils/logger';

const guildMemberRemove = createEvent('guildMemberRemove', false, async member => {
  const userId = member.id;
  const guildId = member.guild.id;

  try {
    const guildMember = await prisma.guildMember.delete({
      where: {
        userId_guildId: {
          userId,
          guildId,
        },
      },
    });

    if (!guildMember) return;

    await prisma.guildMember.delete({
      where: {
        userId_guildId: {
          userId,
          guildId,
        },
      },
    });
  } catch (error) {
    logger.error(error, 'Error fetching guild member for guildMemberRemove event.');
  }
});

export default guildMemberRemove;
