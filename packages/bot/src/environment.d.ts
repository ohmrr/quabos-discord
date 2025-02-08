declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development';
      CONNECTION_STRING: string;
      DISCORD_TOKEN: string;
      DEV_GUILD_ID: string;
      TZ: string;
    }
  }
}

export {};
