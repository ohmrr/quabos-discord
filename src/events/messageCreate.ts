import { createEvent } from '../interfaces/ApplicationEvents';

const messageCreate = createEvent('messageCreate', false, (client, message) => {
	console.log(message.content);
});

export default messageCreate;
