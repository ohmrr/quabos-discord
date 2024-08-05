import { createEvent } from '../../interfaces/applicationEvent';
import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { prisma } from '../..';
import path from 'path';

const loadEventFromFile = async (client: Client, filePath: string) => {
  try {
    const eventModule = (await import(filePath)).default;

    if (!eventModule.name || !eventModule.execute) {
      console.log(
        `${filePath} is missing properties. Skipping onto the next file...`,
      );

      return;
    }

    const event = createEvent(
      eventModule.name,
      eventModule.once,
      eventModule.execute,
    );

    if (event.once) {
      client.once(event.name, (...params) => event.execute(prisma, ...params));
    } else {
      client.on(event.name, (...params) => event.execute(prisma, ...params));
    }
  } catch (error) {
    console.error(`Error loading in ${filePath}: ${error}`);
  }
};

const loadEvents = async (client: Client) => {
  const eventFolderPath = path.join(__dirname, '..', '..', 'events');
  const eventFiles = readdirSync(eventFolderPath).filter(file =>
    file.endsWith('.js'),
  );

  for (const file of eventFiles) {
    const eventFilePath = path.join(eventFolderPath, file);
    await loadEventFromFile(client, eventFilePath);
  }
};

export default loadEvents;
