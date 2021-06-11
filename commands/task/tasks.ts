import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando';
import { generateTaskList } from '../../helpers/notion';
import { sendSplitMessage } from '../../helpers/message';

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
		return sendSplitMessage(tasks, msg);
	}
}
