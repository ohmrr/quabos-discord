import { createEvent } from '../interfaces/ApplicationEvents';
import path from 'path';
import fs from 'fs';

function appendMessage(message: string) {
	const messageJsonPath = path.join(__dirname, '..', 'messages.json');

	let messages: string[] = [];
	try {
		const data = fs.readFileSync(messageJsonPath, 'utf8');
		messages = JSON.parse(data);
	} catch (err) {
		console.error(`Error reading file: ${messageJsonPath}`, err);
	}

	messages.push(message);

	try {
		fs.writeFileSync(messageJsonPath, JSON.stringify(messages, null, 2));
	} catch (err) {
		console.error(`Error writing file: ${messageJsonPath}`, err);
	}
}

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
