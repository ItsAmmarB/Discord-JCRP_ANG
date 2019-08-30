const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const error = require('../Messages/Error.js');
const success = require('../Messages/Success.js');


module.exports = class Announce extends Command {
    constructor(client) {
        super(client, {
            name: 'announce',
            aliases: ['ann', 'announcement'],
            group: 'commanders',
            memberName: 'announce',
            description: 'Posts an announcement in the announcements channel and tags everyone.',
            clientPermissions: ['EMBED_LINKS'],
            args:[
                {
                    key: 'title',
                    prompt: 'What is the title of the announcement?',
                    type: 'string'
                },
                {
                    key: 'body',
                    prompt: 'What are the details of the announcement?',
                    type: 'string'
                }
            ]
        });
    }


    run(message, { title, body }) {
        if(!title || title.split('').length < 3) return error.invalid(message, 'announce', 'You need to provide a valid Title for the announcement! | Usage .announce Title&$Body');
        if(!body || body.split('').length < 3) return error.invalid(message, 'announce', 'You need to provide a valid Body for the announcement! | Usage .announce Title&$Body');
        const embed = new RichEmbed()
            .setTitle(title)
            .setDescription(body)
            .setColor('#000000')
            .setFooter('announcement by ' + message.member.displayName)
            .setTimestamp();
        message.guild.channels.get('491683606532587536').send('@everyone').then(msg=> msg.delete(500));
        message.guild.channels.get('491683606532587536').send(embed);
        return success.successWF(message, 'Announcement has been send successfully') && message.delete();
    }
};