import { QueryType } from 'discord-player';
import { ChannelType, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { SlashCommandProps } from 'commandkit';
import { player } from '../..';
export const data = new SlashCommandBuilder()
	.setName('play')
	.setDescription('Plays a track in voice channel.')
	.addSubcommand((subcommand) =>
		subcommand
			.setName('search')
			.setDescription('Searches for a track')
			.addStringOption((option) =>
				option
					.setName('keywords')
					.setDescription('Searches for keywords')
					.setRequired(true),
			),
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName('playlist')
			.setDescription('Plays a playlist from youtube')
			.addStringOption((option) =>
				option.setName('url').setDescription('playlist url').setRequired(true),
			),
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName('song')
			.setDescription('Plays a track from youtube')
			.addStringOption((option) =>
				option.setName('url').setDescription('song url').setRequired(true),
			),
	);
export async function run({ interaction, client, handler }: SlashCommandProps) {
	await interaction.deferReply();

	if (!interaction?.channelId) return;

	const guild = client.guilds.cache.get(interaction.guildId!);
	const member = guild?.members.cache.get(interaction.member?.user.id!);
	const channel = member?.voice.channelId!;

	if (!channel) {
		return interaction.editReply('User is not connected in a voice channel!');
	}

	const ch = await client.channels.fetch(interaction.channelId);

	if (!ch || ch.type !== ChannelType.GuildText) {
		return interaction.editReply(
			'You must write this command in a text channel.',
		);
	}

	const queue = player.queues.create(interaction.guildId!, {
		leaveOnEndCooldown: 80 * 1000,
		leaveOnEnd: true,
		leaveOnEmpty: true,
		leaveOnEmptyCooldown: 80 * 1000,
	});

	if (!queue.connection) await queue.connect(channel);

	const embed = new EmbedBuilder();

	if (interaction.options.getSubcommand() === 'song') {
		const url = interaction.options.getString('url')!;
		const result = await player.search(url, {
			requestedBy: interaction.user,
			searchEngine: QueryType.YOUTUBE_VIDEO,
		});
		if (result.tracks.length === 0) {
			return interaction.editReply("Track could't be found.");
		}

		const song = result.tracks[0];
		queue.addTrack(song);

		embed
			.setDescription(
				`**[${song.title}]**(${song.url}) is added to the panda queue!`,
			)
			.setThumbnail(song.thumbnail);
	} else if (interaction.options.getSubcommand() === 'search') {
		const url = interaction.options.getString('keywords')!;
		const result = await player.search(url, {
			requestedBy: interaction.user,
			searchEngine: QueryType.AUTO,
		});
		if (result.tracks.length === 0) {
			return interaction.editReply("Track could't be found.");
		}

		const song = result.tracks[0];
		queue.addTrack(song);

		embed
			.setDescription(
				`[**${song.title}**](${song.url}) is added to the panda queue!`,
			)
			.setThumbnail(song.thumbnail);
	} else if (interaction.options.getSubcommand() === 'playlist') {
		const url = interaction.options.getString('url')!;
		const result = await player.search(url, {
			requestedBy: interaction.user,
			searchEngine: QueryType.YOUTUBE_PLAYLIST,
		});
		if (result.tracks.length === 0) {
			return interaction.editReply("Playlist could't be found.");
		}

		const playlist = result.playlist;
		queue.addTrack(result.tracks);

		embed
			.setDescription(
				`**[${result.tracks.length} tracks from (${playlist?.title})(${playlist?.url})]** have been to the panda queue!`,
			)
			.setThumbnail(result.tracks[0].thumbnail);
	}

	const entry = queue.tasksQueue.acquire();

	await entry.getTask();

	try {
		if (!queue.isPlaying()) await queue.node.play();
	} finally {
		queue.tasksQueue.release();
	}

	queue.filters.filters?.setFilters([]);
	queue.dispatcher?.setVolume(100);
	return interaction.editReply({
		embeds: [embed],
	});
}
