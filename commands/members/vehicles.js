const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const error = require('../Messages/Error.js');
const fs = require('fs');


module.exports = class Vehicles extends Command {
    constructor(client) {
        super(client, {
            name: 'vehicles',
            aliases: ['vcls'],
            group: 'commanders',
            memberName: 'vehicles',
            description: 'Show yours or someone elses current shift.',
            clientPermissions: ['EMBED_LINKS'],
            args:[
                {
                    key: 'codes',
                    prompt: 'Which member would you like to see his shift?',
                    type: 'string',
                    default: 'vehicles',
                    ondOf:[
                        'codes',
                        'Codes'
                    ]
                }
            ]
        });
    }

    run(message, { codes }) {
        message.delete();
        const _member = message.member || message.guild.fetchMember(message.author);
        const embedColor = _member.colorRole ? _member.colorRole.color : '#ffffff';
        if(message.channel.id !== '493078331504328724') {
            return message.channel.send('**Please Use this command in <#493078331504328724> only!**').then(msg => msg.delete(5000));
        }
        const vehiclesFleet = JSON.parse(fs.readFileSync('./vehiclesFleet.json', 'utf8'));
        const vehicles = Object.keys(vehiclesFleet).map(vehicle => ({ vehicle: vehicle, value: vehiclesFleet[vehicle] }));
        if (codes && codes.toLowerCase() === 'codes') {
            const embed = new RichEmbed()
                .setAuthor('National Guard Vehicles Fleet Spawn Codes')
                .setColor(embedColor);
            vehicles.map(vehicle => embed.addField(vehicle.vehicle.toUpperCase(), `Spawn Code: \`\`${vehicle.value.sc} \`\`\n⠀`, true));
            return message.channel.send(embed);
        }
        else if(codes && codes.toLowerCase() === 'vehicles') {
            const embed = new RichEmbed()
                .setAuthor('National Guard Vehicles Fleet')
                .setFooter('use .vehicles codes to see vehicles spawn codes')
                .setColor(embedColor);
            vehicles.map(vehicle => embed.addField(vehicle.vehicle.toUpperCase(), `Good Condition: \`\`${vehicle.value.Usable}\`\`\nBad Condition:  \`\`${vehicle.value.Broken}\`\`\nLost:  \`\`${vehicle.value.Lost}\`\`\nTotaled:  \`\`${vehicle.value.Totaled}\`\`\n⠀`, true));
            message.channel.send(embed);
        }
        else {
            return error.invalid(message, 'Vehicles', codes + ' is not a subsection of the Vehicle command');
        }
    }
};
