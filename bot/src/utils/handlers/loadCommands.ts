import { Collection, Client } from 'discord.js';
import Command from '../../interfaces/command';
import { readdirSync, statSync } from 'fs';
import path from 'path';

const commands = new Collection<string, Command>();

function getCommandFiles(directory: string) {
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
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      results.push(filePath);
    }
  });

  return results;
}

async function loadCommandFromFile(filePath: string) {
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
}

export default async function loadCommands(client: Client) {
  const commandFolderPath = path.join(__dirname, '..', '..', 'commands');
  const commandFiles = getCommandFiles(commandFolderPath);

  for (const filePath of commandFiles) {
    await loadCommandFromFile(filePath);
  }

  client.commands = commands;
}
