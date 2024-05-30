/**
 * Imports the Client class from the discord.js library.
 * This allows creating a Discord bot client instance.
 */
import Discord, { GatewayIntentBits } from 'discord.js';
import config from './config';
import { Player } from 'discord-player';
import { CommandKit } from 'commandkit';

export const client = new Discord.Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildVoiceStates,
	],
});

new CommandKit({
	client,
	eventsPath: `${__dirname}/events`,
	commandsPath: `${__dirname}/commands`,
	bulkRegister: true,
	devUserIds: ['403887698344935427'],
	devGuildIds: ['1066125486389997598'],
});

export const player = new Player(client, {
	ytdlOptions: {
		quality: 'highestaudio',
		highWaterMark: 1 << 25,
	},
});

player.extractors.loadDefault();

client.login(config.DISCORD_TOKEN);
