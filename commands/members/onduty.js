const { Command } = require('discord.js-commando');
const fs = require('fs');
const error = require('../Messages/Error.js');
const success = require('../Messages/Success.js');
const moment = require('moment-timezone');

const rank = {
    '571728950758342684':{ name: 'Private' },
    '580843991944396833':{ name: 'Private Second Class' },
    '571728924032237589':{ name: 'Private First Class' },
    '571728887533535262':{ name: 'Specialist' },
    '571728831229067284':{ name: 'Corporal' },
    '571728746298474529':{ name: 'Sargent' },
    '571728708814110721':{ name: 'Staff Sargent' },
    '580843992841715739':{ name: 'Sargent First Class' },
    '580843993722519552':{ name: 'Master Sargent' },
    '580843994150338571':{ name: 'First Sargent' },
    '580843995178074121':{ name: 'Sargent Major' },
    '580843995542978583':{ name: 'Command Sergeant  Major' },
    '571728665684213820':{ name: '2nd Lieutenant' },
    '571728608775897099':{ name: '1st Lieutenant' },
    '491683830722461696':{ name: 'Captain' },
    '580844358857785384':{ name: 'Major' },
    '491683829849784321':{ name: 'Colonel' },
    '491683823063662602':{ name: 'General' }
};

module.exports = class BotInfo extends Command {
    constructor(client) {
        super(client, {
            name: 'onduty',
            aliases: ['ond', 'on'],
            group: 'commanders',
            memberName: 'onduty',
            description: 'Starts your shift.',
            clientPermissions: ['MANAGE_MESSAGES']
        });
    }


    async run(message) {
        message.delete();
        if(message.channel.id !== '594114465188937728') {
            return message.channel.send('**Please Use this command in <#594114465188937728> only!**').then(msg => msg.delete(5000));
        }
        if(!message.member.roles.find(role => rank[role.id])) return error.invalid(message, 'OnDuty', 'You need to have a rank within the Army National Guard to go onduty');
        if(!message.member.displayName.includes('ANG-') || !message.member.displayName.includes('.') || !message.member.displayName.includes('|')) return error.invalid(message, 'OnDuty', 'Your discord nickname is not properly set, please fix it to go onduty');
        if(message.member.roles.get('491792414005133322')) return error.invalid(message, 'OnDuty', 'You are on a Re-Training period and you are not allowed to go onduty');


        const shiftsFiler = JSON.parse(fs.readFileSync('./commands/shiftsFiler.json', 'utf8'));
        if(shiftsFiler[message.author.id]) return error.invalid(message, 'OnDuty', 'You\'re already on a shift that have started at ' + shiftsFiler[message.author.id].ShiftStartTime);

        shiftsFiler[message.author.id] = {
            Name: message.member.displayName.toString().split('.').slice(1).join('.'),
            ShiftStartTime: moment().tz('America/New_York').format('MMM Do YYYY | h:mm A'),
            TimestampStart: message.createdTimestamp
        };
        await message.member.setNickname('[Duty] ' + message.member.displayName);
        await message.member.addRole('592850469978767387');

        fs.writeFile('./commands/shiftsFiler.json', JSON.stringify(shiftsFiler), function(err) {
            if (err) return console.error(err);
        });
        success.successWF(message, 'Your shift has started!');
    }
};