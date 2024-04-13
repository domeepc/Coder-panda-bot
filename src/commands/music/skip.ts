import { ChannelType, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { player } from '../..';
import { SlashCommandProps } from 'commandkit';

export const data = new SlashCommandBuilder()
	.setName('skip')
	.setDescription('Skips to next track.');

export async function run({ interaction, client, handler }: SlashCommandProps) {
	await interaction.deferReply();

	if (!interaction?.channelId) return;
	const guild = client.guilds.cache.get(interaction.guildId!);
	const member = guild?.members.cache.get(interaction.member?.user.id!);
	const channel = member?.voice.channelId!;

	if (!channel) {
		return interaction.editReply(
			'User is not connected in a voice channel!',
		);
	}

	const ch = await client.channels.fetch(interaction.channelId);

	if (!ch || ch.type !== ChannelType.GuildText) {
		return interaction.editReply(
			'You must write this command in a text channel.',
		);
	}

	const queue = player.queues.get(interaction.guildId!);

	if (!queue) {
		return interaction.editReply('There are no tracks in the panda queue.');
	}

	const currentSong = queue.currentTrack;

	try {
		queue.node.skip();
	} finally {
		queue.tasksQueue.release();
	}

	return interaction.editReply({
		embeds: [
			new EmbedBuilder()
				.setDescription(`${currentSong?.title} has been skipped!`)
				.setThumbnail(currentSong?.thumbnail!),
		],
	});
}
