import { readdirSync } from 'fs';
import path from 'path';
import { createEvent } from '../interfaces/applicationEvent';
import logger from '../utils/logger';
import { client } from '../utils/quabos';

async function loadEventFromFile(filePath: string) {
  try {
    const { default: eventModule } = (await import(filePath)).default;

    if (!eventModule.name || !eventModule.execute) {
      logger.warn(filePath, 'Event is missing properties. Skipping onto next file.');

      return;
    }

    const event = createEvent(eventModule.name, eventModule.once, eventModule.execute);

    if (event.once) {
      client.once(event.name, (...params) => event.execute(...params));
    } else {
      client.on(event.name, (...params) => event.execute(...params));
    }
  } catch (error) {
    logger.error({ filePath, error }, 'Unable to initialize event listener.');
  }
}

async function loadEvents() {
  const eventFolderPath = path.join(__dirname, '..', 'events');
  const eventFiles = readdirSync(eventFolderPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const eventFilePath = path.join(eventFolderPath, file);
    await loadEventFromFile(eventFilePath);
  }
}

export default loadEvents;
