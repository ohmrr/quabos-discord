import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { createEvent } from '../interfaces/applicationEvent';

async function loadEventFromFile(client: Client, filePath: string) {
  try {
    const { default: eventModule } = (await import(filePath)).default;

    if (!eventModule.name || !eventModule.execute) {
      console.log(`${filePath} is missing properties. Skipping onto the next file...`);

      return;
    }

    const event = createEvent(eventModule.name, eventModule.once, eventModule.execute);

    if (event.once) {
      client.once(event.name, (...params) => event.execute(...params));
    } else {
      client.on(event.name, (...params) => event.execute(...params));
    }
  } catch (error) {
    console.error(`Event Execution Error ${filePath}: ${error}`);
  }
}

async function loadEvents(client: Client) {
  const eventFolderPath = path.join(__dirname, '..', 'events');
  const eventFiles = readdirSync(eventFolderPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const eventFilePath = path.join(eventFolderPath, file);
    await loadEventFromFile(client, eventFilePath);
  }
}

export default loadEvents;
