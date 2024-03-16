import { createEvent } from '../interfaces/applicationEvent';
import appendMessage from '../utils/appendMessage';

const messageCreate = createEvent('messageCreate', false, message => {
  if (!message.guild || !message.channel) return;
  if (message.author.bot || message.system) return;

  try {
    appendMessage(message.content);
  } catch (err) {
    console.error('Error storing messages: ', err);
  }
});

export default messageCreate;
