import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import Subcommand from './subcommand';

interface Command {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder;
  subcommands?: Record<string, Subcommand>;
  permissions?: PermissionsBitField;
  usage: string;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export default Command;
