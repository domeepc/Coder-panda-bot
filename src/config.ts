/**
 * Imports the dotenv module to load environment variables from .env file.
 */
import dotenv from 'dotenv';
dotenv.config();
/**
 * Gets the Discord client ID, guild ID, and authentication token
 * from the environment variables.
 */
const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN } = process.env;

/**
 * Throws an error if any of the required environment variables are missing.
 * The required environment variables are CLIENT_ID, GUILD_ID, and DISCORD_TOKEN.
 * These variables are used later in the config to connect to Discord.
 */
if (!CLIENT_ID || !GUILD_ID || !DISCORD_TOKEN) {
	throw new Error('Missing environment variables');
}

/**
 * Configuration object containing the Discord client ID, guild ID,
 * and authentication token loaded from environment variables.
 */
const config: Record<string, string> = {
	CLIENT_ID,
	GUILD_ID,
	DISCORD_TOKEN,
};

/**
 * Exports the config object containing the Discord credentials loaded from environment variables.
 */
export default config;
