import { Collection } from 'discord.js';
import Command from './interfaces/command';

declare module 'discord.js' {
  interface Client {
    version: string;
    commands: Collection<string, Command>;
    cooldowns: Collection<string, Collection<string, number>>;
    inactivityTriggers: Collection<string, number>;
  }
}
