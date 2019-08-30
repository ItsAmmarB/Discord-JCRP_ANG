const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const error = require('../Messages/Error.js');
const fs = require('fs');
const ms = require('pretty-ms');


module.exports = class Shift extends Command {
    constructor(client) {
        super(client, {
            name: 'shift',
            aliases: ['sft'],
            group: 'commanders',
            memberName: 'shift',
            description: 'Show yours or someone elses current shift.',
            clientPermissions: ['EMBED_LINKS'],
            args:[
                {
                    key: 'member',
                    prompt: 'Which member would you like to see his shift?',
                    type: 'user',
                    default: ''
                }
            ]
        });
    }

    run(message, { member }) {
        message.delete();
        const _member = message.mentions.members.first() || message.guild.members.get(member.id) || message.member;
        const embedColor = _member.colorRole ? _member.colorRole.color : '#ffffff';
        if(message.channel.id !== '493078331504328724') {
            return message.channel.send('**Please Use this command in <#493078331504328724> only!**').then(msg => msg.delete(5000));
        }
        if(!member) member = message.member;
        const shiftsFiler = JSON.parse(fs.readFileSync('./commands/shiftsFiler.json', 'utf8'));

        if(!shiftsFiler[member.id]) return error.invalid(message, 'Shift', 'Member is not on-duty');
        const Total = message.createdTimestamp - shiftsFiler[member.id].TimestampStart;
        message.channel.send(new RichEmbed().setAuthor(_member.displayName, member.avatarURL).setDescription('Member has a total shift time of ' + ms(Total, { verbose: true, secondsDecimalDigits: 0 }) + ' till now!').addField('Shift Start Time', shiftsFiler[member.id].ShiftStartTime).addField('Shift Start Timestamp', shiftsFiler[member.id].TimestampStart).setFooter('The above information is only 80% accurate.').setColor(embedColor));
    }
};
