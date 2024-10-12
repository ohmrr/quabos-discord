import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

interface Subcommand {
  data: SlashCommandSubcommandBuilder;
  usage: string;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export default Subcommand;
