const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const colors = require('colors');
const prefix = '.';

const applicationsProcess = require('./applicationsProcess.js').applicationsProcess;

colors.setTheme({
    success: 'green',
    error: 'red',
    warn: 'yellow',
    debug: 'cyan'
});

const client = new CommandoClient({
    commandPrefix: prefix,
    owner: '357842475328733186',
    invite: 'https://discord.gg/B7e72je',
    unknownCommandResponse: false
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['members', 'Commands that can be used by all U.S. Army National Guard Personnel.'],
        ['commanders', 'Commands that can be used only by U.S. Army National Guard Commanders and above.']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        help: true
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`.success);
    console.log(`Prefix is set to: ${prefix}`.debug);
});

client.on('error', console.error);

client.once('ready', () => client.user.setActivity('Fort Zancudo Base', { type: 'WATCHING' }));

client.once('ready', async ()=>{applicationsProcess(client);});

client.login('NTc2NTk4NDQ4OTA0NjAxNjEw.XNY14w.GIP1TSIa_Plv6LLD-Nwa7Q15h2I');