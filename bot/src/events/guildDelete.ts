import { createEvent } from "@interfaces/applicationEvent";

const guildDelete = createEvent('guildDelete', false, async (prisma, guild) => {
  try {
    await prisma.guild.delete({ where: { guildId: guild.id } });
  } catch (error) {
    console.error(`Error while deleting guild: `, error);
    throw new Error(`Failed to delete guild. Name: ${guild.name} ID: ${guild.id}`);
  }
});

export default guildDelete;
