import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando';
import { createTask } from '../../helpers/notion';

export default class CreateTaskCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'createtask',
			aliases: ['addtask'],
			group: 'task',
			memberName: 'createtask',
			description: 'Creates a new task',
			// prettier-ignore
			args: [
				{
					key: 'title',
					prompt: 'Task title',
					type: 'string',
				},
				{
					key: 'importance',
					prompt: 'Task importance',
					type: 'string',
					default: 'semi-important',
					oneOf: [
						'unimportant',
						'semi', 'semi-important',
						'important'
					],
				},
				{
					key: 'type',
					prompt: 'Task type',
					type: 'string',
					default: ''
				},
				{
					key: 'url',
					prompt: 'Task URL',
					type: 'string',
					default: ''
				}
			],
		});
	}

	async run(msg: CommandoMessage, args: { title: string; importance: string; type: string; url: string }) {
		var task = {
			title: {
				name: 'Title',
				type: 'title',
				title: [
					{
						type: 'text',
						text: {
							content: args.title,
						},
					},
				],
			},
			Importance: {
				name: 'Importance',
				type: 'select',
				select: {
					name: args.importance,
				},
			},
			Status: {
				name: 'Status',
				type: 'select',
				select: {
					name: 'To Do',
				},
			},
			Type: args.type
				? {
						name: 'Type',
						type: 'select',
						select: {
							name: args.type,
						},
				  }
				: undefined,
			URL: args.url
				? {
						name: 'URL',
						type: 'url',
						url: args.url,
				  }
				: undefined,
		};
		// @ts-ignore
		createTask(task);
		return null;
	}
}
