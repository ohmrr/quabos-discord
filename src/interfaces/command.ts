import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { PrismaClient } from '@prisma/client';

interface Command {
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute: (prisma: PrismaClient, interaction: ChatInputCommandInteraction) => void;
}

export default Command;
