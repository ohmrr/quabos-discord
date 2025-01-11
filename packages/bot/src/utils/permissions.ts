import { ChatInputCommandInteraction, PermissionsBitField, TextChannel } from 'discord.js';
import type Command from '../interfaces/command';

interface PermissionResult {
  canExecute: boolean;
  missingPermissions?: PermissionsBitField[];
}

export function userPermissions(
  interaction: ChatInputCommandInteraction,
  command: Command,
): PermissionResult {
  if (!interaction.guild || !(interaction.channel instanceof TextChannel))
    return { canExecute: false };

  const guildMember = interaction.guild.members.cache.get(interaction.user.id);
  const memberPermissions = guildMember?.permissionsIn(interaction.channel);
  if (!memberPermissions) return { canExecute: false };

  const subcommandName = interaction.options.getSubcommand(false);
  let requiredPermissions: PermissionsBitField[] = [];

  if (subcommandName && command.subcommands) {
    const subcommand = command.subcommands[subcommandName];

    if (subcommand.permissions) {
      if (!memberPermissions.has(subcommand.permissions)) {
        requiredPermissions.push(subcommand.permissions);
      }
    }
  } else {
    if (command.permissions && !memberPermissions.has(command.permissions)) {
      requiredPermissions.push(command.permissions);
    }
  }

  return {
    canExecute: requiredPermissions.length === 0,
    missingPermissions: requiredPermissions.length > 0 ? requiredPermissions : undefined,
  };
}
