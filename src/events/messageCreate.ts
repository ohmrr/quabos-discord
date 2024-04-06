import { createEvent } from '../interfaces/applicationEvent';

const messageCreate = createEvent('messageCreate', false, (prisma, message) => {
  if (!message.guild || !message.channel) return;
  if (message.author.bot || message.system) return;

  const startsWithCommandCharacter = /^[!\/?]/i;
  if (startsWithCommandCharacter.test(message.content)) {
    return;
  }
});

export default messageCreate;
