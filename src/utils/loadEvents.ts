import { Client } from 'discord.js';
import { createEvent } from '../interfaces/applicationEvent';
import { readdirSync } from 'fs';
import path from 'path';

const loadEvents = (client: Client) => {
  const eventFolderPath = path.join(__dirname, '..', 'events');
  const eventFiles = readdirSync(eventFolderPath).filter((file) =>
    file.endsWith('.js'),
  );
  eventFiles.forEach(async (file) => {
    try {
      const eventModule = (await import(`${eventFolderPath}/${file}`)).default;

      if (!eventModule.name || !eventModule.execute) {
        console.log(
          `${eventFolderPath}/${file} is missing properties. Skipping onto the next file...`,
        );

        return;
      }

      const event = createEvent(
        eventModule.name,
        eventModule.once,
        eventModule.execute,
      );

      if (event.once) {
        client.once(event.name, (...params) => event.execute(...params));
      } else {
        client.on(event.name, (...params) => event.execute(...params));
      }
    } catch (err) {
      console.error(`Error loading in ${eventFolderPath}/${file}: `, err);
    }
  });
};

export default loadEvents;
