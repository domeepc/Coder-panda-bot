import { SlashCommandProps } from 'commandkit';
import { SlashCommandBuilder, ChannelType, EmbedBuilder } from 'discord.js';
export const data = new SlashCommandBuilder()
	.setName('server')
	.setDescription('Gives information about the server');

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
		interaction.editReply(
			'This panda command is used in text channels.',
		);
		return;
	}

	const embed = new EmbedBuilder();

	const memberCount = interaction.guild?.memberCount!;

	const ownerId = interaction.guild?.ownerId!;

	const rolesArray = interaction.guild?.roles.fetch()!;
	const rolesString = (await rolesArray)
		.map((role) => role.name)
		.join(', ')
		.replace('@everyone,', '');

	embed.setTitle('Server Info').setDescription(
		`Owner: <@${ownerId}>\nMember count: ${memberCount}\nRoles: ${rolesString}`,
	);

	return interaction.editReply({
		embeds: [embed],
	});
}
