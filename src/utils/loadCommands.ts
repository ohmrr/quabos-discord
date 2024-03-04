import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import Command from '../interfaces/command';
import path from 'path';

const commands = new Collection<string, Command>();

const loadCommandFromFile = async (filePath: string) => {
  try {
    const commandModule = (await import(filePath)).default;
    const cmd = commandModule as Command;

    if (!cmd.data || !cmd.execute) {
      console.log(
        `${filePath} is missing properties. Skipping onto the next file...`,
      );
      return;
    }

    commands.set(cmd.data.name, cmd);
  } catch (error) {
    console.error(`Error loading in ${filePath}: ${error}`);
  }
};

export const loadCommands = async () => {
  const commandFolderPath = path.join(__dirname, '..', 'commands');
  const commandFiles = readdirSync(commandFolderPath).filter((file) =>
    file.endsWith('.js'),
  );

  for (const file of commandFiles) {
    const commandFilePath = path.join(commandFolderPath, file);
    await loadCommandFromFile(commandFilePath);
  }
};

export { commands };
