import { Client } from 'discord.js';
import { CommandKit } from 'commandkit';

export default function (
	c: Client<true>,
	client: Client<true>,
	handler: CommandKit,
) {
	console.log('🐼 Coder Panda is ready to eat some bamboo 🎋!');
}
