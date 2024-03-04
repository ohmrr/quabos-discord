import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import Command from '../interfaces/command';
import path from 'path';

const commands = new Collection<string, Command>();

export const loadCommands = () => {
	const commandFolderPath = path.join(__dirname, '..', 'commands');
	const commandFiles = readdirSync(commandFolderPath).filter((file) =>
		file.endsWith('.js'),
	);
	commandFiles.forEach(async (file) => {
		try {
			const commandModule = (await import(`${commandFolderPath}/${file}`)).default;
			const cmd = commandModule as Command;

			if (!cmd.data || !cmd.execute) {
				console.log(
					`${commandFolderPath}/${file} is missing properties. Skipping onto the next file...`,
				);
			}

			commands.set(cmd.data.name, cmd);
		} catch (err) {
			console.error(`Error loading in ${commandFolderPath}/${file}: `, err);
		}
	});
};

export { commands };
