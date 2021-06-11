import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando'

export default class TaskListCommand extends Command {
	constructor (client: CommandoClient) {
		super (client, {
			name: 'tasks',
			aliases: [],
			group: 'task',
			memberName: 'tasks',
			description: 'Lists all uncompleted tasks',
			ownerOnly: true,

			args: []
		});
	}

	async run (msg: CommandoMessage, args: any) {
		return msg.reply('@todo')
	}
}