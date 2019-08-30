const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');


module.exports = class Roster extends Command {
    constructor(client) {
        super(client, {
            name: 'roster',
            aliases: ['rstr', 'rs'],
            group: 'commanders',
            memberName: 'roster',
            description: 'Show the U.S. Army National Guard\'s Roster.',
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
        const ranks = ['571728950758342684', '580843991944396833', '571728924032237589', '571728887533535262', '571728831229067284', '571728746298474529', '571728708814110721', '580843992841715739', '580843993722519552', '580843994150338571', '580843995178074121', '580843995542978583', '571728665684213820', '571728608775897099', '491683830722461696', '580844358857785384', '491683829849784321', '491683823063662602'];
        const embed = new RichEmbed();
        embed.setAuthor('U.S. Army National Guard Roaster');
        embed.setDescription('Callsign | Name | Battalion');
        embed.setThumbnail(this.client.user.avatarURL);
        embed.setColor(embedColor);
        const soldiers = {};
        const NGmen = message.guild.members.filter(_member => _member.displayName.includes('ANG-') && _member.displayName.includes('.') || _member.displayName.includes('B-') && _member.displayName.includes('.'));
        NGmen.map(_member => {
            if(_member.roles.get('491686458994851842')) {
                soldiers[_member.id] = { callsign: _member.displayName.toString().split(' | ')[0], name: _member.displayName.toString().split(' | ').slice(1).join('').split(' ').slice(1, _member.displayName.toString().split(' | ').slice(1).join('').split(' ').length).join(' '), battalion:'49th' };
            }
            else if(_member.roles.get('491683837219438612')) {
                soldiers[_member.id] = { callsign: _member.displayName.toString().split(' | ')[0], name: _member.displayName.toString().split(' | ').slice(1).join('').split(' ').slice(1, _member.displayName.toString().split(' | ').slice(1).join('').split(' ').length).join(' '), battalion:'33rd' };
            }
            else{
                soldiers[_member.id] = { callsign: _member.displayName.toString().split(' | ')[0], name: _member.displayName.toString().split(' | ').slice(1).join('').split(' ').slice(1, _member.displayName.toString().split(' | ').slice(1).join('').split(' ').length).join(' '), battalion:'General\'s Office' };
            }
        });
        for (let i = 0; i < ranks.length; i++) {
            const rank = message.guild.roles.get(ranks[i]);
            if(rank.members.size < 1) {
                embed.addField(rank.name + '  |  ' + rank.members.size, 'No ranked national guard member in position!');
            }
            else {
                embed.addField(rank.name + '  |  ' + rank.members.size, rank.members.filter(_member => soldiers[_member.id]).map(_member => soldiers[_member.id].callsign.toString() + ' | ' + soldiers[_member.id].name.toString() + ' | ' + soldiers[_member.id].battalion.toString()));
            }
        }
        message.channel.send(embed);
        return;
    }
};