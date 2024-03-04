import { Client, ClientEvents } from 'discord.js';

export interface ApplicationEvent<K extends keyof ClientEvents> {
  name: K;
  once: boolean;
  execute: (...params: ClientEvents[K]) => void;
}

export const createEvent = <K extends keyof ClientEvents>(
  name: K,
  once: boolean,
  execute: (...params: ClientEvents[K]) => void,
): ApplicationEvent<K> => ({ name, once, execute });
