import { createEvent } from '../interfaces/applicationEvent';
import appendMessage from '../utils/appendMessage';

const messageCreate = createEvent('messageCreate', false, (prisma, message) => {
  if (!message.guild || !message.channel) return;
  if (message.author.bot || message.system) return;

  const startsWithCommandCharacter = /^[!\/?]/i;
  if (startsWithCommandCharacter.test(message.content)) {
    return;
  }

  try {
    appendMessage(message);
  } catch (err) {
    console.error('Error storing messages: ', err);
  }
});

export default messageCreate;
