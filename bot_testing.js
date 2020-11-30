require('dotenv').config();
const axios = require('axios');
const Discord = require('discord.js');

const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const { COOKIE, oauth } = require('./constants');

// logs the bot in with the bot token
bot.login(TOKEN);

//
//module.exports = EmojiBot;

// function addemoji (guildid, url, name){

//   bot.on('ready', () => {
//     console.info(`Logged in as ${bot.user.tag}!`);

//     const guild = bot.guilds.cache.get(guildid);

//     guild.emojis.create(url, name).then(emoji=>console.log('created new emoji')).catch(console.error);
//   });

// }

// bot.on('message', msg => {
//   if (msg.content === 'hi') {
//     msg.reply('nou');
//     msg.channel.send('hello');
//   }

// });

// create an emoji based on a message
// bot.on('message', msg=>{
//   if (msg.content === 'emoji') {
//   msg.channel.send('adding an emoji');

//   const guild = bot.guilds.cache.get("781353966574370816");

//   const url='https://emoji.gg/assets/emoji/9410_homu_brb.png';
//   const name='boba';

//   guild.emojis.create(url, name).then(emoji=>console.log('created new emoji')).catch(console.error);
//   }
// })



// on new member added
// client.on('guildMemberAdd', member => {
// 	const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
// 	if (!channel) return;

// 	channel.send(`Welcome to the server, ${member}!`);
// });