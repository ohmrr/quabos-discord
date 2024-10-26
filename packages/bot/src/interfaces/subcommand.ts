import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandSubcommandBuilder } from 'discord.js';

interface Subcommand {
  data: SlashCommandSubcommandBuilder;
  permissions?: PermissionsBitField;
  usage: string;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export default Subcommand;
