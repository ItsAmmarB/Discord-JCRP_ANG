/* eslint-disable max-nested-callbacks */
const Discord = require('discord.js');
const fs = require('fs');
const nau = require('nau');
const moment = require('moment-timezone');

module.exports.applicationsProcess = async (client) => {

    await client.guilds.get('491683606054567946').channels.get('577188742926827520').fetchMessages().then(messages =>{
        client.guilds.get('491683606054567946').channels.get('577188742926827520').bulkDelete(messages.size);
    });
    const embed2 = new Discord.RichEmbed()
        .setColor('#00000')
        .setTitle('United State National Guard')
        .setThumbnail(client.user.avatarURL)
        .setDescription('To apply for United States National Guard make sure you have read our discord rules in <#576871830598713394>.\nApplicant Requirements:')
        .addField('Applicant Rule 1', 'Seriousness, you have to be serious in every scenario and action you take.')
        .addField('Applicant Rule 2', 'Commitment, you have to complete your tasks at its best always.')
        .addField('Applicant Rule 3', 'Obeying Orders, you will obey, and will obey every order involves you from the higher ups.')
        .setFooter('If you are intersted in joining the United States National Guard and you agree to those Rules listed above and the Discord Rules as well as the Civilian Operations Rules, you may react with the check box under this message and you\'ll be redirected to a praivte application channel.');
    const msg = await client.guilds.get('491683606054567946').channels.get('577188742926827520').send(embed2);
    await msg.react('✅');
    client.on('messageReactionAdd', async (reaction, user)=>{
        if(user.bot) return;
        if(reaction.message.id !== msg.id) return;
        const responses = JSON.parse(fs.readFileSync('./commands/responses.json', 'utf8'));
        const test = 'your-application-' + user.id;
        const appChannel = reaction.message.guild.channels.find(channel => channel.name === test);
        // console.log(reaction.message.guild.channels.get("576881019320401920").name)
        if(responses[user.id] && responses[user.id].timestamp < nau()) {
            await reaction.remove(user.id);
            await user.send(`**You already have pending application submitted at ${responses[user.id].date}, please be patient!**`);
            return;
        }
        if(appChannel) {
            await reaction.remove(user.id);
            await appChannel.send(`<@${user.id}>`).then(_msg => _msg.delete(1000));
            return;
        }
        await reaction.message.guild.createChannel(test, 'test').then(async channel => {
            await channel.setParent('577159747267067910');
            await channel.overwritePermissions(channel.guild.id, {
                READ_MESSAGES: false
            });
            await channel.overwritePermissions(user.id, {
                READ_MESSAGES: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true
            });
            await reaction.remove(user);
            const embed3 = new Discord.RichEmbed()
                .addField('Applicant Rule 1', 'Seriousness, you have to be serious in every scenario and action you take.')
                .addField('Applicant Rule 2', 'Commitment, you have to complete your tasks at its best always.')
                .addField('Applicant Rule 3', 'Obeying Orders, you will obey, and will obey every order involves you from the higher ups.');
            await channel.send(embed3);
            await channel.send('**If you agree to the rules listed above reply with Agree, otherwise disagree, or cancel to cancel at anytime!**');
            const filter1 = m => m.author.id === user.id && (m.content.toLowerCase() === 'agree' || m.content.toLowerCase() === 'disagree' || m.content.toLowerCase() === 'cancel');
            await channel.awaitMessages(filter1, { max:1, time:0 }).then(async msg1 => {
                const agreement = msg1.first().content.toLowerCase();
                if(agreement === 'disagree') {
                    await channel.fetchMessages().then(messages => channel.bulkDelete(messages.size));
                    channel.send('**❌ We regret to say that for you to take a part of the U.S. Army National Guard you need to agree the previous rules, and abide by it throughout your career in the U.S. Army National Guard.**');
                    setTimeout(() => {
                        channel.delete();
                    }, 10000);
                    return;
                }
                else if(agreement === 'cancel') {
                    return channel.delete();
                }
                await channel.fetchMessages().then(messages => channel.bulkDelete(messages.size));
                await channel.send('**What is your First and Last name?**');
                const filter2 = m => m.author.id === user.id || m.author.id === user.id && m.content.toLowerCase() === 'cancel';
                await channel.awaitMessages(filter2, { max:1, time:0 }).then(async msg2 => {
                    const name = msg2.first().content.toLowerCase();
                    if(name === 'cancel') {
                        return channel.delete();
                    }
                    await channel.fetchMessages().then(messages => channel.bulkDelete(messages.size));
                    await channel.send('**How old are you?**\nPlease only provide a number!');
                    const filter8 = m => m.author.id === user.id && m.content.toLowerCase() === 'cancel' || m.author.id === user.id && !isNaN(m.content);
                    await channel.awaitMessages(filter8, { max:1, time:0 }).then(async msg8 => {
                        const age = msg8.first().content.toLowerCase();
                        if(age === 'cancel') {
                            return channel.delete();
                        }
                        else if (age < 14) {
                            await channel.fetchMessages().then(messages => channel.bulkDelete(messages.size));
                            channel.send('**❌ We regret to say that for you to take a part of the U.S. Army National Guard you need by at least 14 years old.**');
                            setTimeout(() => {
                                channel.delete();
                            }, 10000);
                            return;
                        }
                        await channel.fetchMessages().then(messages => channel.bulkDelete(messages.size));
                        await channel.send('**What is your date of birth?**    Format: dd/mm/yyyy  Example: 03/10/1994');
                        const filter3 = m => m.author.id === user.id && m.content.includes('/') || m.author.id === user.id && m.content.toLowerCase() === 'cancel';
                        await channel.awaitMessages(filter3, { max:1, time:0 }).then(async msg3 => {
                            const dateOfBirth = msg3.first().content.toLowerCase();
                            if(dateOfBirth === 'cancel') {
                                return channel.delete();
                            }
                            await channel.fetchMessages().then(messages => channel.bulkDelete(messages.size));
                            await channel.send('**Tell us about yourself?**\nNote: Must be at least 50 words!');
                            const filter4 = m => m.author.id === user.id && m.content.toString().split(' ').length > 49 || m.author.id === user.id && m.content.toLowerCase() === 'cancel';
                            await channel.awaitMessages(filter4, { max:1, time:0 }).then(async msg4 => {
                                const intro = msg4.first().content.toLowerCase();
                                if(intro === 'cancel') {
                                    return channel.delete();
                                }
                                await channel.fetchMessages().then(messages => channel.bulkDelete(messages.size));
                                await channel.send('**Why do you want to join the U.S. Army National guard?**\nNote: Must be at least 50 words!');
                                const filter5 = m => m.author.id === user.id && m.content.toString().split(' ').length > 49 || m.author.id === user.id && m.content.toLowerCase() === 'cancel';
                                await channel.awaitMessages(filter5, { max:1, time:0 }).then(async msg5 => {
                                    const why = msg5.first().content.toLowerCase();
                                    if(why === 'cancel') {
                                        return channel.delete();
                                    }
                                    await channel.fetchMessages().then(messages => channel.bulkDelete(messages.size));
                                    await channel.send('**What do you think in your own mind the U.S. Army National guard does?**\nNote: Must be at least 50 words!');
                                    const filter6 = m => m.author.id === user.id && m.content.toString().split(' ').length > 49 || m.author.id === user.id && m.content.toLowerCase() === 'cancel';
                                    await channel.awaitMessages(filter6, { max:1, time:0 }).then(async msg6 => {
                                        const ops = msg6.first().content.toLowerCase();
                                        if(ops === 'cancel') {
                                            return channel.delete();
                                        }
                                        await channel.fetchMessages().then(messages => channel.bulkDelete(messages.size));
                                        await channel.send('**Are you willing to take orders from any higher up regardless of their age, sex, color or nationality?**\nAnswer with Yes, No or Maybe!');
                                        const filter7 = m => m.author.id === user.id && (m.content.toLowerCase() === 'yes' || m.content.toLowerCase() === 'no' || m.content.toLowerCase() === 'maybe' || m.content.toLowerCase() === 'cancel');
                                        await channel.awaitMessages(filter7, { max:1, time:0 }).then(async msg7 => {
                                            const obey = msg7.first().content.toLowerCase();
                                            if(obey === 'cancel') {
                                                return channel.delete();
                                            }
                                            else if (obey === 'no') {
                                                channel.send('**❌ We regret to say that for you to take a part of the U.S. Army National Guard you need to obey all orders involving you from higher ups regardless or their differences, and obey them throughout your career in the U.S. Army National Guard.**');
                                                setTimeout(() => {
                                                    channel.delete();
                                                }, 10000);
                                                return;
                                            }
                                            await channel.fetchMessages().then(messages => channel.bulkDelete(messages.size));
                                            await channel.send('**✔ We are glad to inform you that your application for the U.S. Army National Guard has been successfully submitted, please check you Direct Messages (DMs) for more information.**');
                                            const appThru = new Discord.RichEmbed()
                                                .setAuthor(user.tag, user.avatarURL)
                                                .setDescription(`Application submitted by <@${user.id}>!`)
                                                .addField('Username', user.username, true)
                                                .addField('ID', user.id, true)
                                                .addField('First and last name', name, true)
                                                .addField('Age', age)
                                                .addField('Date of Birth', dateOfBirth)
                                                .addField('Tell us about yourself', intro)
                                                .addField('Why do you want to join', why)
                                                .addField('What do you think we do', ops)
                                                .addField('Obeying orders', obey)
                                                .setTimestamp()
                                                .setThumbnail(user.avatarURL);
                                            await channel.overwritePermissions(user.id, {
                                                READ_MESSAGES: true,
                                                SEND_MESSAGES: false
                                            });
                                            responses[user.id] = {
                                                userID: user.id,
                                                date: moment().tz('America/New_York').format('MMM Do YYYY | h:mm A'),
                                                timestamp: nau()
                                            };
                                            await fs.writeFile('./commands/responses.json', JSON.stringify(responses), function(err) {
                                                if (err) return console.error(err);
                                            });
                                            await channel.guild.members.get(user.id).addRole('576921691221917717');
                                            await channel.guild.channels.get('576901836762644490').send(user, appThru);
                                            await user.send('**Your application has been submitted successfully, Please allow up to 72 hours to get a response from our recruitment division!\nKeep in mind that telling drill instructors to train you constantly will only get you denied!\nWe really appreciate your interest in U.S. Army National Guard.\n\nGood Luck,\nU.S. Army National Guard Recruitment Division**');
                                            setTimeout(() => {
                                                channel.delete();
                                            }, 10000);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};