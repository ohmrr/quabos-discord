declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONNECTION_STRING: string;
      DISCORD_TOKEN: string;
      NODE_ENV: 'production' | 'development';
      DEV_GUILD_ID: string;
      [key: string]: string;
    }
  }
}

export { };

