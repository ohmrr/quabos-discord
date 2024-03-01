import { createEvent } from '../interfaces/ApplicationEvents';
import appendMessage from '../utils/appendMessage';

const messageCreate = createEvent('messageCreate', false, (client, message) => {
	if (!message.guild || !message.channel) return;
	if (message.author.bot) return;

	try {
		appendMessage(message.content);
	} catch (err) {
		console.error('Error storing messages: ', err);
	}
});

export default messageCreate;
