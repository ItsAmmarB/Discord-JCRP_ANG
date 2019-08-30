const { Command } = require('discord.js-commando');

module.exports = class Unban extends Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            aliases: ['ub', 'unbean'],
            group: 'commanders',
            memberName: 'unban',
            description: 'Unbans a user from the guild.',
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: ['BAN_MEMBERS'],
            guildOnly: true,
            hidden: true,
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would you like to unban?',
                    type: 'user'
                },
                {
                    key: 'reason',
                    prompt: 'Why are you unbanning this user?',
                    type: 'string',
                    default: 'No reason provided.'
                }
            ]
        });
    }

    run(message, { user, reason }) {
        message.delete();
        if(message.channel.id !== '493078331504328724') {
            return message.channel.send('**Please Use this command in <#493078331504328724> only!**').then(msg => msg.delete(5000));
        }

        // delete the command entered by the user
        message.delete();

        try {
            message.guild.unban(user, reason);
        }
        catch(e) {
            console.log(e.stack);
            return message.say('Uh oh! Something went wrong, developer notified');
        }

        return message.say(`***${user.username}#${user.discriminator} was unbanned${reason === 'No reason provided.' ? '.' : ' for ' + reason}***`);
    }
};