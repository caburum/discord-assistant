import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando'
import * as Notion from '../../helpers/notion'

export default class TaskListCommand extends Command {
	constructor (client: CommandoClient) {
		super (client, {
			name: 'tasks',
			aliases: [],
			group: 'task',
			memberName: 'tasks',
			description: 'Lists all uncompleted tasks'
		});
	}

	async run (msg: CommandoMessage, args: any) {
		var db = await Notion.getDB('6b0c2f1f-cf80-4091-8db4-ef9a13e6e2c3');
		return msg.reply(JSON.stringify(db));
	}
}