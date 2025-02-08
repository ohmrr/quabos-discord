import { readdirSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import type Command from '../interfaces/command.js';
import logger from '../utils/logger.js';
import { utilEmojis } from '../utils/emoji.js';
import { client } from '../utils/client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getCommandFiles(directory: string) {
  const directoryItems = readdirSync(directory);
  const fileList = [];

  for (const item of directoryItems) {
    const itemPath = path.join(directory, item);

    if (statSync(itemPath).isDirectory()) {
      const mainCommandFile = path.join(itemPath, `${item}.js`);
      fileList.push(mainCommandFile);
    } else if (itemPath.endsWith('.js')) {
      fileList.push(itemPath);
    }
  }

  return fileList;
}

async function loadCommandFromFile(filePath: string) {
  try {
    const commandUrl = pathToFileURL(filePath).href;
    const { default: commandModule } = await import(commandUrl);
    const command = commandModule as Command;

    if (!command.data || !command.execute) {
      logger.warn(
        filePath,
        `${utilEmojis.error} Command is missing properties. Skipping onto the next file...`,
      );
      return;
    }
    client.commands.set(command.data.name, command);
  } catch (error) {
    logger.error(error, `${utilEmojis.error} Error fetching command data.`);
  }
}

export default async function loadCommands() {
  const commandDir = path.join(__dirname, '..', 'commands');
  const fileList = getCommandFiles(commandDir);

  for (const file of fileList) {
    await loadCommandFromFile(file);
  }
}
