import { SlashCommandBuilder } from 'discord.js';
import Command from '../interfaces/command';

const help: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('')
    .setDMPermission(false),
  usage: '/help [command]',
  execute: async interaction => {},
};

export default help;
