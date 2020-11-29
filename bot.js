// BOT FILE
// THE BOT'S DUTIES + RESPONSIBILITIES
// Only in charge of doing things directly on discord
// bot goes live whenever the server is live

// DEPENDENCIES
require('dotenv').config();
const axios = require('axios');
const Discord = require('discord.js');

const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const { COOKIE, oauth } = require('./constants');

// logs the bot in with the bot token
bot.login(TOKEN);

// BOT EVENT LISTENERS - https://discord.js.org/#/docs/main/stable/class/Client
// Check that the bot is alive
bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);

});


bot.on('message', msg => {

  if (msg.content === 'hi') {

    console.log(bot.emojis)
  }

});


// BOT FUNCTIONS
function addEmoji(guildid, url, name) {
  const guild = bot.guilds.cache.get(guildid); // need to get guild.id through selection in route or elsewhere and pass through


  // get the first text channel in the guild
  var channel = guild.channels.cache.filter(ch => ch.type === "text").find(c => c.position === 0);
  //const channel = bot.channels.cache.get(channelid);

  guild.emojis.create(url, name).catch(() => null);

  channel.send(`Emoji '${name}' added`, { files: [url] });
}


function getGuildEmoji(guildid){
  console.log(bot.emojis.cache);
}



module.exports = { addEmoji };





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
