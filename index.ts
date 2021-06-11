import * as Commando from 'discord.js-commando';
import { discord as config } from './config.json';
import * as path from 'path';

const client = new Commando.CommandoClient({
	owner: config.owner,
	commandPrefix: config.prefix,
});

client.registry
	// Registers your custom command groups
	.registerGroups([
		['general', 'General commands'],
		['task', 'Task commands'],
		['fun', 'Fun commands'],
	])

	// Registers all built-in commands, groups, and argument types
	.registerDefaultTypes()
	.registerDefaultGroups()
	.registerDefaultCommands({
		unknownCommand: false,
	})

	// Registers all types in the ./types/ directory
	// .registerTypesIn({
	// 	filter: /^([^.].*)\.(js|ts)$/,
	// 	dirname: path.resolve('types')
	// })

	// Registers all commands in the ./commands/ directory
	.registerCommandsIn({
		filter: /^([^.].*)\.(js|ts)$/,
		dirname: path.resolve('commands'),
	});

// Look for .ts files instead of .js files for commands
client.registry.resolveCommandPath = function (group, memberName) {
	return path.join(client.registry.commandsPath, group, `${memberName}.ts`);
};

// Make all commands owner-only
client.dispatcher.addInhibitor((msg) => {
	return client.isOwner(msg.author) ? false : 'not the owner';
});

// Events
client
	.on('error', console.error)
	.on('warn', console.warn)
	// .on('debug', console.log)
	.on('ready', () => {
		console.log(`Client ready; logged in as ${client.user?.username}#${client.user?.discriminator} (${client.user?.id})`);
	})
	.on('disconnect', () => {
		console.warn('Disconnected!');
	})
	.on('commandError', (cmd, err, msg, reason, args_4) => {
		if (err instanceof Commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	// @ts-ignore
	// .on('commandBlock', (msg, reason, data) => {
	// 	console.log(`Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''} blocked; ${reason}`);
	// })
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(`Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(`Command ${command.groupID}:${command.memberName} ${enabled ? 'enabled' : 'disabled'} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(`Group ${group.id} ${enabled ? 'enabled' : 'disabled'} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
	});

// Login
client.login(config.token);
