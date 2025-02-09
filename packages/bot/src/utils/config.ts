import 'dotenv/config';
import { z } from 'zod';
import { utilEmojis } from './emoji.js';
import logger from './logger.js';

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development']).default('development'),
  CONNECTION_STRING: z.string(),
  DISCORD_TOKEN: z.string(),
  DEV_DISCORD_TOKEN: z.string().optional(),
  DEV_GUILD_ID: z.string().optional(),
  TZ: z.string().default('America/Los_Angeles'),
});

const env = envSchema.parse(process.env);

const config = {
  nodeEnv: env.NODE_ENV,
  connectionString: env.CONNECTION_STRING,
  discordToken:
    env.NODE_ENV === 'development' && env.DEV_DISCORD_TOKEN?.trim()
      ? env.DEV_DISCORD_TOKEN
      : env.DISCORD_TOKEN,
  devGuildId:
    env.NODE_ENV === 'development'
      ? env.DEV_GUILD_ID ||
        (() => {
          logger.error(
            `${utilEmojis.error} Environment variable DEV_GUILD_ID is required if NODE_ENV is set to "development". Please add a Discord server ID for slash command deployment or switch NODE_ENV to "production" in your .env file.`,
          );

          process.exit(1);
        })()
      : undefined,
  tz: env.TZ,
};

export default config;
