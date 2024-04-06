import { SlashCommandProps } from 'commandkit';
import { TextChannel, ChannelType, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('help')
	.setDescription('Creates a new help ticket.')
	.addStringOption((option) =>
		option
			.setName('description')
			.setDescription('Describe your problem')
			.setRequired(true),
	);

export async function run({ interaction, client, handler }: SlashCommandProps) {
	await interaction.deferReply();

	if (!interaction.inCachedGuild()) {
		interaction.editReply('You need to use this panda command in a server.');
		return;
	}

	const channel = await client.channels.fetch(interaction.channelId);

	if (channel?.type !== ChannelType.GuildText) {
		interaction.editReply('This panda command is used in text channels.');
		return;
	}

	const thread = await (channel as TextChannel).threads.create({
		name: `support-${Date.now()}`,
		reason: `Support ticket ${Date.now()}`,
	});

	const problemDescription = interaction.options.get('description')?.value!;
	const { user } = interaction;
	thread.send(`**User:** ${user}
**Problem:** ${problemDescription}`);

	return interaction.reply({
		content: 'Help is on the way!',
		ephemeral: true,
	});
}
