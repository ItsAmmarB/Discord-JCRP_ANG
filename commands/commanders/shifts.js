const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const fs = require('fs');
const ms = require('pretty-ms');
const error = require('../Messages/Error.js');


module.exports = class Shifts extends Command {
    constructor(client) {
        super(client, {
            name: 'shifts',
            aliases: ['sfts', 'sf'],
            group: 'commanders',
            memberName: 'shifts',
            description: 'Show the weekly activity report of the week in the current state.',
            clientPermissions: ['MANAGE_MESSAGES']
        });
    }


    run(message) {
        message.delete();
        if(message.channel.id !== '493078331504328724') {
            return message.channel.send('**Please Use this command in <#493078331504328724> only!**').then(msg => msg.delete(5000));
        }
        const WS = JSON.parse(fs.readFileSync('./commands/shifts.json', 'utf8'));
        const shifts = Object.keys(WS).map(user => ({ user: user, shifts: WS[user] }));
        if(!shifts[0]) return error.invalid(message, 'Shifts', 'There isn\'t any shifts logged this week');
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        const embed = new RichEmbed()
            .setDescription('Activity report of the week')
            .addField('Callsign     |     Name', '\n' + shifts.map(user => '‌‌ ‌‌ ‌‌ ‌‌ ' + message.guild.members.get(user.user).displayName).toString().split(',').join('\n'), true)
            .addField('Total Week Activity', '\n' + shifts.map(user => '‌‌ ‌‌ ‌‌ ‌‌ ' + ms(user.shifts.reduce(reducer), { verbose: true, secondsDecimalDigits: 0 })).toString().split(',').join('\n'), true)
            .setFooter('THIS MAY NOT BE THE COMPLETE ACTIVITY REPORT OF THE WEEK!')
            .setColor('black');
        message.channel.send(embed);
    }
};