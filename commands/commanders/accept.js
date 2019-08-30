const { Command } = require('discord.js-commando');
const fs = require('fs');
const error = require('../Messages/Error.js');
const success = require('../Messages/Success.js');


module.exports = class Accept extends Command {
    constructor(client) {
        super(client, {
            name: 'appaccept',
            aliases: ['appac', 'aa'],
            group: 'commanders',
            memberName: 'appaccept',
            description: 'Accepts an applicant\'s application.',
            argsType: '',
            clientPermissions: ['MANAGE_MESSAGES'],
            args:[
                {
                    key: 'applicant',
                    prompt: 'Who do you want to accept their application?',
                    type: 'user'
                }
            ]
        });
    }


    run(message, { applicant }) {
        message.delete();
        if(message.channel.id !== '493078331504328724') {
            return message.channel.send('**Please Use this command in <#493078331504328724> only!**').then(msg => msg.delete(5000));
        }
        const target = message.guild.members.get(applicant.id);
        if(!applicant) return error.invalid(message, 'appAccept', 'You need to provide the recruit\'s ID | Usage: .accept <APPLICANT ID>');
        if(!target.roles.get('576921691221917717')) return error.invalid(message, 'appAccept', 'You cannot accept a non-applicant users, make sure he is an applicant');
        if(target.roles.get('520007973666422785')) return error.invalid(message, 'appAccept', 'You cannot accept a recruit, you can only accept applicants');
        if(target.roles.get('576921691221917717') && target.roles.get('491683840931135488')) return error.invalid(message, 'appAccept', 'Applicant is already Enlisted?!, how is that even possible?');
        target.setRoles(['520007973666422785', '491683840931135488']);
        message.delete();
        message.guild.channels.get('576901836762644490').fetchMessages().then(async messages => {
            messages.filter(msg => msg.content.includes(target)).first().react('✅');
            messages.filter(msg => msg.content.includes(target)).first().edit(target + ' **: Applicant accepted by **' + message.author);
        });
        const responses = JSON.parse(fs.readFileSync('./commands/responses.json', 'utf8'));
        delete responses[applicant.id];
        fs.writeFile('./commands/responses.json', JSON.stringify(responses), function(err) {
            if(err) return console.error(err);
        });
        target.send('✅ **Your US National Guard application has been accepted, you have been given the required roles.\nMake sure to look over the discord as new channels has been unlocked for you, these channel contain some vital information for you training,\nThank you for your interst in US National Guard, Good luck...**');
        return success.successWF(message, `${target} Has been accepted, required roles has been assigned successfully`);
    }
};