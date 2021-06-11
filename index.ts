import * as Commando from 'discord.js-commando'
import * as config from './config.json'
import * as path from 'path'

const discord = new Commando.CommandoClient({
	owner: config.owner,
	commandPrefix: config.prefix
});

discord.registry
	// Registers your custom command groups
	.registerGroups([
		['general', 'General commands'],
		['task', 'Task commands'],
		['fun', 'Fun commands']
	])

	// Registers all built-in commands, groups, and argument types
	.registerDefaultTypes()
	.registerDefaultGroups()
	.registerDefaultCommands({
		unknownCommand: false
	})

	// Registers all types in the ./types/ directory
	// .registerTypesIn({
	// 	filter: /^([^.].*)\.(js|ts)$/,
	// 	dirname: path.resolve('types')
	// })

	// Registers all commands in the ./commands/ directory
	.registerCommandsIn({
		filter: /^([^.].*)\.(js|ts)$/,
		dirname: path.resolve('commands')
	});

discord
	.on('error', console.error)
	.on('warn', console.warn)
	// .on('debug', console.log)
	.on('ready', () => {
		console.log(`Client ready; logged in as ${discord.user?.username}#${discord.user?.discriminator} (${discord.user?.id})`);
	})
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('commandError', (cmd, err, msg, reason, args_4) => {
		if (err instanceof Commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	// @ts-ignore
	.on('commandBlock', (msg, reason, data) => {
		console.log(`Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''} blocked; ${reason}`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(`Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(`Command ${command.groupID}:${command.memberName} ${enabled ? 'enabled' : 'disabled'} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(`Group ${group.id} ${enabled ? 'enabled' : 'disabled'} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
	});

discord.login(config.token)