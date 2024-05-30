import { SlashCommandProps } from 'commandkit';
import {
	ChannelType,
	PermissionFlagsBits,
	GuildMember,
	SlashCommandBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('ban')
	.setDescription('Bans an user from the server.')
	.addStringOption((option) =>
		option
			.setName('reason')
			.setDescription('What is the reason for ban.')
			.setRequired(true),
	)
	.addMentionableOption((option) =>
		option
			.setName('target-user')
			.setDescription('The user to ban')
			.setRequired(true),
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

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

	const targetUser = interaction.options.getMember(
		'target-user',
	) as GuildMember;

	const reason = interaction.options.getString('reason') ?? 'No reason given';

	if (!targetUser) {
		interaction.editReply("That user doesn't exist.");
		return;
	}

	if (targetUser.id === interaction.guild?.ownerId) {
		interaction.editReply("You can't ban the server owner.");
		return;
	}

	const targetUserRolePosition = targetUser.roles.highest.position;
	const botRolePosition =
		interaction.guild?.members.me?.roles.highest.position!;

	if (targetUserRolePosition >= botRolePosition) {
		interaction.editReply(
			"I can't ban that user they have the same or higher role than me.",
		);
		return;
	}

	try {
		await targetUser.ban({ reason });
		return interaction.editReply(
			`User ${targetUser} is banned.\nReason: ${reason}`,
		);
	} catch (error) {
		console.log(`There was an error while banning: ${error}`);
	}
}
