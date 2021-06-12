import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando';
import { MessageEmbed } from 'discord.js';
import { generateTaskList } from '../../helpers/notion';
import { getColor } from '../../helpers/util';
import { CompoundFilter, SinglePropertyFilter } from '@notionhq/client/build/src/api-types';

export default class TaskListCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'tasks',
			aliases: [],
			group: 'task',
			memberName: 'tasks',
			description: 'Lists all uncompleted tasks',
			// prettier-ignore
			args: [
				{
					key: 'status',
					prompt: 'Select a status to filter by',
					type: 'string',
					default: 'all',
					oneOf: [
						'all',
						'todo', 'upcoming',
						'working', 'progress',
						'done', 'completed'
					],
				},
				{
					key: 'importance',
					prompt: 'Select an importance to filter by',
					type: 'string',
					default: 'all',
					oneOf: [
						'all',
						'unimportant',
						'semi', 'semi-important',
						'important'
					],
				},
			],
		});
	}

	async run(msg: CommandoMessage, args: { status: string; importance: string }) {
		console.log(args);
		var statusFilter: SinglePropertyFilter | undefined = {
				property: 'Status',
				select: {
					equals: undefined,
				},
			},
			importanceFilter: SinglePropertyFilter | undefined = {
				property: 'Importance',
				select: {
					equals: undefined,
				},
			},
			filter: CompoundFilter | SinglePropertyFilter | undefined = undefined;
		switch (args.status) {
			default:
			case 'all': {
				statusFilter = undefined;
				break;
			}
			case 'todo' || 'upcoming': {
				statusFilter.select.equals = 'To Do';
				break;
			}
			case 'working' || 'progress': {
				statusFilter.select.equals = 'In progress';
				break;
			}
			case 'done' || 'completed': {
				statusFilter.select.equals = 'Completed';
				break;
			}
		}

		switch (args.importance) {
			default:
			case 'all': {
				importanceFilter = undefined;
				break;
			}
			case 'unimportant': {
				importanceFilter.select.equals = 'Unimportant';
				break;
			}
			case 'semi' || 'semi-important': {
				importanceFilter.select.equals = 'Semi-Important';
				break;
			}
			case 'important': {
				importanceFilter.select.equals = 'Important';
				break;
			}
		}

		if (statusFilter && importanceFilter) {
			filter = {
				and: [statusFilter, importanceFilter],
			};
		} else if (statusFilter) {
			filter = statusFilter;
		} else if (importanceFilter) {
			filter = importanceFilter;
		}

		var tasks = await generateTaskList(filter);

		console.log(tasks);

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
