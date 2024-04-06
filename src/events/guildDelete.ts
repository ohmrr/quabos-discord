import { createEvent } from '../interfaces/applicationEvent';

const guildDelete = createEvent('guildDelete', false, async (prisma, guild) => {
  const { id } = guild;

  await prisma.guild.delete({ where: { guildId: id } });
});

export default guildDelete;
