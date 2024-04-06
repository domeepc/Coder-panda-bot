import { ChannelType, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { player } from '../..';
import { SlashCommandProps } from 'commandkit';

export const data = new SlashCommandBuilder()
	.setName('queue')
	.setDescription('Displays the curent panda queue.')
	.addNumberOption((option) =>
		option
			.setName('page')
			.setDescription('Page number of the panda queue.')
			.setMinValue(1),
	);

export async function run({ interaction, client, handler }: SlashCommandProps) {
	await interaction.deferReply();

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

	const queue = player.queues.get(interaction.guildId!);

	if (!queue || !queue.isPlaying()) {
		return interaction.editReply('There are no tracks in the panda queue.');
	}

	const totalPages = Math.ceil(queue.tracks.size / 10) || 1;
	const page = (interaction.options.getNumber('page') || 1) - 1;

	if (page > totalPages) {
		return interaction.editReply(
			`Invalid page. There are only a total of ${totalPages} pages.`,
		);
	}

	const queueString = queue.tracks
		.toArray()
		.slice(page * 10, page * 10 + 10)
		.map((song, i) => {
			return `**${page * 10 + i + 1}**. \`[${song.duration}]\` ${
				song.title
			} -- Author: **${song.author}**`;
		})
		.join('\n');

	const currentSong = queue.currentTrack;

	return interaction.editReply({
		embeds: [
			new EmbedBuilder()
				.setDescription(
					`**Currently Playing**\n` +
						(currentSong
							? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy?.id}>`
							: 'None') +
						`\n\n**Panda Queue**\n${queueString}`,
				)
				.setFooter({ text: `Page ${page + 1} of ${totalPages}` })
				.setThumbnail(currentSong?.thumbnail!),
		],
	});
}
