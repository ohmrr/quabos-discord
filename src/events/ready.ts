import { ClientEvent } from '..';

const ClientReady: ClientEvent = {
	name: 'ClientReady',
	once: true,
	execute: () => {
		console.log('READY!');
	},
};

export default ClientReady;
