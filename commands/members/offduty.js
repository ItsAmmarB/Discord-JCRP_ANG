const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const fs = require('fs');
const ms = require('pretty-ms');
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
            name: 'offduty',
            aliases: ['ofd', 'off'],
            group: 'commanders',
            memberName: 'offduty',
            description: 'Ends your shift.',
            clientPermissions: ['MANAGE_MESSAGES']
        });
    }


    async run(message) {
        message.delete();
        if(message.channel.id !== '594114465188937728') {
            return message.channel.send('**Please Use this command in <#594114465188937728> only!**').then(msg => msg.delete(5000));
        }
        if(!message.member.roles.find(role => rank[role.id])) return error.invalid(message, 'OffDuty', 'You need to have a rank within the Army National Guard to go OffDuty');
        if(!message.member.displayName.includes('ANG-') || !message.member.displayName.includes('.') || !message.member.displayName.includes('|')) return error.invalid(message, 'OffDuty', 'Your discord nickname is not properly set, please fix it to go OffDuty');
        try{
            const WS = JSON.parse(fs.readFileSync('./commands/shifts.json', 'utf8'));
            const shiftsFiler = JSON.parse(fs.readFileSync('./commands/shiftsFiler.json', 'utf8'));
            if(!shiftsFiler[message.author.id]) return error.invalid(message, 'OffDuty', 'You\'re currently Off-Duty');
            const Total = message.createdTimestamp - shiftsFiler[message.author.id].TimestampStart;
            const totalTime = ms(message.createdTimestamp - shiftsFiler[message.author.id].TimestampStart, { verbose: true, secondsDecimalDigits: 0 });
            await message.member.setNickname(message.member.displayName.toString().split('[Duty]').slice(1).join(''));
            await message.member.removeRole('592850469978767387');
            if(message.createdTimestamp - 480000 < shiftsFiler[message.author.id].TimestampStart || message.createdTimestamp - 43200000 > shiftsFiler[message.author.id].TimestampStart) {
                success.successF(message, 'Your shift has been ended!', 'Total shift time is ' + totalTime);
                const embed = new RichEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .setDescription(`${message.author}'s shift at ${moment().tz('America/New_York').format('MMM Do YYYY')} !`)
                    .addField('Name', message.member.displayName.toString().split('.').slice(1).join('.'), true)
                    .addField('Callsign', message.member.displayName.toString().split('|').slice(0, 1), true)
                    .addField('Rank', message.member.roles.filter(role=> rank[role.id]).first().name, true)
                    .addField('Shift Start Time', shiftsFiler[message.author.id].ShiftStartTime, true)
                    .addField('End Start Time', moment().tz('America/New_York').format('MMM Do YYYY | h:mm A'), true)
                    .addField('Total Shift Time', ms(message.createdTimestamp - shiftsFiler[message.author.id].TimestampStart, { verbose: true, secondsDecimalDigits: 0 }))
                    .setColor('#d63431')
                    .setTimestamp();
                delete shiftsFiler[message.author.id];
                fs.writeFile('./commands/shiftsFiler.json', JSON.stringify(shiftsFiler), function(err) {
                    if (err) return console.error(err);
                });
                return message.guild.channels.get('576609831377698837').send(embed);
            }
            if(!WS[message.author.id]) {
                WS[message.author.id] = [];
            }

            WS[message.author.id].push(Total);
            const embed = new RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setDescription(`${message.author}'s shift at ${moment().tz('America/New_York').format('MMM Do YYYY')} !`)
                .addField('Name', message.member.displayName.toString().split('.').slice(1).join('.'), true)
                .addField('Callsign', message.member.displayName.toString().split('|').slice(0, 1), true)
                .addField('Rank', message.member.roles.filter(role=> rank[role.id]).first().name, true)
                .addField('Shift Start Time', shiftsFiler[message.author.id].ShiftStartTime, true)
                .addField('End Start Time', moment().tz('America/New_York').format('MMM Do YYYY | h:mm A'), true)
                .addField('Total Shift Time', ms(message.createdTimestamp - shiftsFiler[message.author.id].TimestampStart, { verbose: true, secondsDecimalDigits: 0 }))
                .setColor('#268709')
                .setTimestamp();


            delete shiftsFiler[message.author.id];
            fs.writeFile('./commands/shiftsFiler.json', JSON.stringify(shiftsFiler), function(err) {
                if (err) return console.error(err);
            });
            fs.writeFile('./commands/shifts.json', JSON.stringify(WS), function(err) {
                if (err) return console.error(err);
            });
            message.guild.channels.get('576609831377698837').send(embed);
            success.successF(message, 'Your shift has been ended!', 'Total shift time is ' + totalTime);
        }
        catch(err) {
            console.log(err);
            error.error(message, 'Fatal Error', 'An error occurred, please notify the @Development Office as soon as possible!');
        }
    }
};