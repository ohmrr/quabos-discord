import { createEvent } from '../interfaces/applicationEvent';

const guildCreate = createEvent('guildCreate', false, async (prisma, guild) => {
  await prisma.guild.create({
    data: {
      guildId: guild.id,
    },
  });
});

export default guildCreate;
