const { Command } = require('discord.js-commando');
const fs = require('fs');
const error = require('../Messages/Error.js');
const success = require('../Messages/Success.js');


module.exports = class Deny extends Command {
    constructor(client) {
        super(client, {
            name: 'appdeny',
            aliases: ['appde', 'ad'],
            group: 'commanders',
            memberName: 'appdeny',
            description: 'Denies an applicant\'s application.',
            argsType: '',
            clientPermissions: ['MANAGE_MESSAGES'],
            args:[
                {
                    key: 'applicant',
                    prompt: 'Who do you want to deny their application?',
                    type: 'user'
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason of their denial?',
                    error: 'You need to provide a valid reason for the denial!',
                    type: 'string',
                    wait: 120,
                    min: 10
                }
            ]
        });
    }


    run(message, { applicant, reason }) {
        message.delete();
        if(message.channel.id !== '493078331504328724') {
            return message.channel.send('**Please Use this command in <#493078331504328724> only!**').then(msg => msg.delete(5000));
        }
        const target = message.guild.members.get(applicant.id);
        if(!applicant) return error.invalid(message, 'appDeny', 'You need to provide the recruit\'s ID | Usage: .accept <APPLICANT ID>');
        if(!target.roles.get('576921691221917717')) return error.invalid(message, 'appDeny', 'You cannot deny a non-applicant user, make sure they are an applicant');
        if(target.roles.get('520007973666422785')) return error.invalid(message, 'appDeny', 'You cannot deny a recruit, you can only accept applicants');
        if(target.roles.get('576921691221917717') && target.roles.get('491683840931135488')) return error.invalid(message, 'appDeny', 'Applicant is already Enlisted?!, how is that even possible?');
        if(!reason) return error.invalid(message, 'appDeny', 'You need to provide a reason for the denial!');
        target.setRoles([]);
        message.delete();
        message.guild.channels.get('576901836762644490').fetchMessages().then(async messages => {
            messages.filter(msg => msg.content.includes(target)).first().react('❌');
            messages.filter(msg => msg.content.includes(target)).first().edit(target + ' : Applicant denied by ' + message.author);
        });
        const responses = JSON.parse(fs.readFileSync('./commands/responses.json', 'utf8'));
        delete responses[applicant.id];
        fs.writeFile('./commands/responses.json', JSON.stringify(responses), function(err) {
            if(err) return console.error(err);
        });
        target.send('❌ Your US National Guard application has been denied for the following reason: \n - ' + reason + '\nIf you\'re still intersted you can apply again with the same procedure.\nThank you for you interst in US National Guard, Good luck...');
        return success.successWF(message, `${target} Has been denied, applicant roles has been unassigned!`);
    }
};
