import { Collection, Client } from 'discord.js';
import Command from '../../interfaces/command';
import { readdirSync } from 'fs';
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

const loadCommands = async (client: Client) => {
  const commandFolderPath = path.join(__dirname, '..', '..', 'commands');
  const commandFiles = readdirSync(commandFolderPath).filter(file =>
    file.endsWith('.js'),
  );

  for (const file of commandFiles) {
    const commandFilePath = path.join(commandFolderPath, file);
    await loadCommandFromFile(commandFilePath);
  }

  client.commands = commands;
};

export default loadCommands;
