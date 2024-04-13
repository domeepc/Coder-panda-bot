import { SlashCommandProps } from 'commandkit';
import { ChannelType, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Info about Coder Panda.');

export async function run({ interaction, client, handler }: SlashCommandProps) {
	await interaction.deferReply();

	if (!interaction.inCachedGuild()) {
		interaction.editReply(
			'You need to use this panda command in a server.',
		);
		return;
	}

	const channel = await client.channels.fetch(interaction.channelId);

	if (channel?.type !== ChannelType.GuildText) {
		interaction.editReply('This panda command is used in text channels.');
		return;
	}

	const { user } = interaction;

	return interaction.editReply(
		`Hello **${user}**.` +
			"My name is Coder Panda 🐼. I am still new guy on the block so I don't have my Dragon Warrior potential. However, I am created for multipurpose things by yt creator domepc. If you want to see all commands type `/`. It is bamboo time see ya soon.",
	);
}
