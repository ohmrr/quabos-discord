import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import createEvent from '../interfaces/event.js';
import { client } from '../utils/client.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function loadEvents() {
  const eventDir = path.join(__dirname, '..', 'events');
  const eventFiles = readdirSync(eventDir).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const eventFilePath = path.join(eventDir, file);
    await loadEventFromFile(eventFilePath);
  }
}

async function loadEventFromFile(filePath: string) {
  try {
    const moduleUrl = pathToFileURL(filePath).href;
    const { default: eventModule } = await import(moduleUrl);

    if (!eventModule.name || !eventModule.execute) {
      logger.warn(
        { filePath },
        'Event is missing properties. Skipping onto the next file...',
      );
      return;
    }

    const event = createEvent(
      eventModule.name,
      eventModule.once,
      eventModule.execute,
    );
    if (event.once)
      client.once(event.name, (...params) => event.execute(...params));
    else client.on(event.name, (...params) => event.execute(...params));
  } catch (error) {
    logger.error(
      { filePath, error },
      'There was an error initializing an event listener.',
    );
  }
}
