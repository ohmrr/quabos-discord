import path from 'path';
import fs from 'fs';

const appendMessage = (message: string) => {
	if (!message.length) return;

	const messageJsonPath = path.join(__dirname, '..', 'data', 'messages.json');

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
};

export default appendMessage;
