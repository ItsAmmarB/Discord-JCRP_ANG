const { Command } = require('discord.js-commando');

module.exports = class Kick extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            aliases: ['k'],
            group: 'commanders',
            memberName: 'kick',
            description: 'Kicks a user from the guild.',
            userPermissions: ['KICK_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS'],
            guildOnly: true,
            hidden: true,
            args: [
                {
                    key: 'member',
                    prompt: 'Which member would you like to kick?',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: 'Why would you like to kick this member?',
                    type: 'string'
                }
            ]
        });
    }

    run(message, { member, reason }) {
        message.delete();
        if(message.channel.id !== '493078331504328724') {
            return message.channel.send('**Please Use this command in <#493078331504328724> only!**').then(msg => msg.delete(5000));
        }

        // delete the command entered by the user
        message.delete();

        // prevent banning yourself
        if (member.user.id === message.author.id) {
            return message.reply('you can\'t kick yourself!', {
                file: '.\\images\\trust-nobody.jpg'
            });
        }

        try {
            member.kick(reason);
        }
        catch (e) {
            console.log(e.stack);
            return message.say('Uh oh! Something went wrong, developer notified');
        }
        return message.say(`***${member.user.username} was kicked for ${reason}!***`);
    }
};