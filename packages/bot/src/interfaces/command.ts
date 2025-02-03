import type {
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandBuilder,
  PermissionsBitField,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
} from "discord.js";

export default interface Command {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandBuilder
    | SlashCommandOptionsOnlyBuilder;
  permissions?: PermissionsBitField;
  usage: string;
  cooldown?: number;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}
