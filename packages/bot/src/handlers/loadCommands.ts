import { Client, Collection } from 'discord.js';
import { readdirSync, statSync } from 'fs';
import path from 'path';
import Command from '../interfaces/command';
import logger from '../utils/logger';

const commands = new Collection<string, Command>();

function getCommandFiles(directory: string): string[] {
  let results: string[] = [];
  const list = readdirSync(directory);

  list.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      const mainCommandFilePath = path.join(filePath, `${file}.js`);
      if (statSync(mainCommandFilePath).isFile()) {
        results.push(mainCommandFilePath);
      } else {
        results = results.concat(getCommandFiles(filePath));
      }
    } else if (file.endsWith('.js')) {
      results.push(filePath);
    }
  });

  return results;
}

async function loadCommandFromFile(filePath: string) {
  try {
    const { default: commandModule } = (await import(filePath)).default;
    const cmd = commandModule as Command;

    if (!cmd.data || !cmd.execute) {
      logger.warn(filePath, 'Command is missing properties. Skipping onto next file.');
      return;
    }

    commands.set(cmd.data.name, cmd);
  } catch (error) {
    logger.error({filePath, error}, 'Unable to load in command file.');
  }
}

export default async function loadCommands(client: Client) {
  const commandFolderPath = path.join(__dirname, '..', 'commands');
  const commandFiles = getCommandFiles(commandFolderPath);

  for (const filePath of commandFiles) {
    await loadCommandFromFile(filePath);
  }

  client.commands = commands;
}
