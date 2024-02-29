import { createEvent } from '../interfaces/ApplicationEvents';

const ready = createEvent('ready', true, client => {
	console.log(`${client.user?.tag} is ready!`);
});

export default ready;