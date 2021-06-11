import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando';
import { MessageEmbed } from 'discord.js';
import { generateTaskList } from '../../helpers/notion';
import { getColor } from '../../helpers/util';

export default class TaskListCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'tasks',
			aliases: [],
			group: 'task',
			memberName: 'tasks',
			description: 'Lists all uncompleted tasks',
		});
	}

	async run(msg: CommandoMessage, args: any) {
		var tasks = await generateTaskList();

		tasks.forEach((task) => {
			let embed = new MessageEmbed().setTitle(task.title).setFooter('Created at').setTimestamp(task.created).setURL(`https://notion.so/${task.id}`);

			if (task.url) embed.setDescription(`[Link](${task.url})`);
			if (task.importance.name) embed.addField('Importance', task.importance.name).setColor(getColor(task.importance.color));
			if (task.status.name) embed.addField('Status', task.status.name);
			if (task.type.name) embed.addField('Type', task.type.name);

			msg.channel.send(embed);
		});

		return null;
	}
}
