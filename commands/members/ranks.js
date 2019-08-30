const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');


module.exports = class Ranks extends Command {
    constructor(client) {
        super(client, {
            name: 'ranks',
            aliases: ['rnks', 'rk'],
            group: 'commanders',
            memberName: 'ranks',
            description: 'Show the U.S. Army National Guard\'s Ranks Protocol.',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    run(message) {
        message.delete();
        const member = message.member || message.guild.fetchMember(message.author);
        const embedColor = member.colorRole ? member.colorRole.color : '#ffffff';
        if(message.channel.id !== '493078331504328724') {
            return message.channel.send('**Please Use this command in <#493078331504328724> only!**').then(msg => msg.delete(5000));
        }
        const embed = new RichEmbed()
            .setAuthor('Army National Guard Ranks Protocol')
            .setThumbnail(this.client.user.avatarURL)
            .setColor(embedColor)
            .setImage('https://drive.google.com/uc?export=view&id=1CHo7B8vevnSmMJKKGMMNO92vGrwqXvIZ');

        return message.channel.send(embed);
    }
};
