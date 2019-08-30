const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');


module.exports = class ChainOfCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'chainofcommand',
            aliases: ['chain', 'coc'],
            group: 'commanders',
            memberName: 'chainofcommand',
            description: 'Show the U.S. Army National Guard\'s Chain Of Command.',
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
            .setAuthor('Army National Guard Chain Of Command')
            .setThumbnail(this.client.user.avatarURL)
            .setColor(embedColor)
            .setImage('https://drive.google.com/uc?export=view&id=1MRAyblr8SnnbVXJBb8un1acI_zaVTVfN');

        return message.channel.send(embed);
    }
};