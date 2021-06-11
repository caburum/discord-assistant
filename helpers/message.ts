import { CommandoMessage } from 'discord.js-commando';

export function sendSplitMessage(content: string | object, message: CommandoMessage) {
	const prependStr = '```\n';
	const appendStr = '\n```';

	if (typeof content === 'object') {
		content = JSON.stringify(content);
	}

	const partsArr = content.match(/[\s\S]{1,1900}/g) || [];

	var isFirst, isLast;

	const partsArrLength = partsArr.length;
	for (var i = 0; i < partsArrLength; i++) {
		var contentChunk = partsArr[i];

		isFirst = i === 0;
		isLast = i === partsArr.length - 1;

		// Strip beginning whitespace
		contentChunk = contentChunk.trim();

		// Send message
		message.channel.send(prependStr + contentChunk + appendStr + ` **${i + 1}/${partsArrLength}**`);
	}
	return null;
}
