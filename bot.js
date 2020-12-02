// BOT FILE
// THE BOT'S DUTIES + RESPONSIBILITIES
// Only in charge of doing things directly on discord
// bot goes live whenever the server is live

// DEPENDENCIES
require('dotenv').config();
const axios = require('axios');
const Canvas = require('canvas');
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

bot.on('message', (msg) => {
  if (msg.content === 'uwubot') {
    msg.reply('hi ❤️');
    //console.log(bot.guilds.cache)

    //781353966574370816
    //getEmoji('783063397154422784');
    deleteEmoji('781353966574370816','783425047268032532', 'somethig')

  }
});

function getEmoji(emojiID) {
  return bot.emojis.cache.get(emojiID);
}

function getGuildEmoji(guildID) {
  const guildEmoji = bot.guilds.cache.get(guildID);
  if (!guildEmoji) {
    return null;
  }
  const emoji = guildEmoji.emojis.cache.map(function (emoji) {
    return { name: emoji.name, url: emoji.url, id: emoji.id };
  });

  return emoji;
}

// BOT FUNCTIONS
function addEmoji(guildID, url, name) {
  const guild = bot.guilds.cache.get(guildID);

  // get the first text channel in the guild
  const channel = guild.channels.cache
    .filter((ch) => ch.type === 'text')
    .find((c) => c.position === 0);

  guild.emojis.create(url, name).catch(() => null);

  rendAndSendEmoji(url, name, channel);

}


//render the emoji and redraw on cavans
//then send it to the channel
async function rendAndSendEmoji(url, name, channel) {
  const canvas = Canvas.createCanvas(100, 100);
  const ctx = canvas.getContext('2d');

  //draw emoji
  const emoji = await Canvas.loadImage(url);
  ctx.drawImage(emoji, 0, 0, canvas.width, canvas.height);

  //add box
  // ctx.fillStyle = "#FFFFFF";
  // ctx.fillRect(0, canvas.height*0.75, canvas.width, canvas.height/5);

  //add text

  ctx.font = 'bolder 15px calibri';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#000000';
  // ctx.fillText(name, canvas.width * 0.5, (canvas.height * 0.9)-10);
  ctx.fillText('UwuMoji', canvas.width * 0.5, canvas.height * 0.9);

  const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    'emoji.png'
  );

  channel.send(`Emoji '${name}' added`, attachment);
}

function getAllGuilds() {
  const allGuildIds = [];

  const allGuilds = bot.guilds.cache.forEach((guild) => {
    allGuildIds.push(guild.id);
  });

  return allGuildIds;
}


// Deletes an Emoji
async function deleteEmoji(guildID, emojiID, name) {

  const guild = bot.guilds.cache.get(guildID);

// get the first text channel in the guild
const channel = guild.channels.cache
.filter((ch) => ch.type === 'text')
.find((c) => c.position === 0);

console.log(channel)

  bot.emojis.cache.get(emojiID).delete();


  channel.send(`Emoji '${name}' deleted`);

}



module.exports = {
  addEmoji,
  deleteEmoji,
  getEmoji,
  getGuildEmoji,
  getAllGuilds,
};


//TODO:
//filtered search
//smart 404 route


//('/:username/videos/:videoid')

// req.params.id  = video