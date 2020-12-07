// BOT FILE
// THE BOT'S DUTIES + RESPONSIBILITIES
// Only in charge of doing things directly on discord
// bot goes live whenever the server is live

// DEPENDENCIES //////////////////////////////////////////////////////////
require('dotenv').config();
const Canvas = require('canvas');
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

// logs the bot in with the bot token
bot.login(TOKEN);

// BOT EVENT LISTENERS - https://discord.js.org/#/docs/main/stable/class/Client
// Check that the bot is alive
bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

// BOT RESPONSE FUNCTIONS
// only visible through discord, not on the site
bot.on('guildCreate', (guild) => {
  let found = 0;
  guild.channels.cache.map((c) => {
    if (found === 0) {
      if (channel.type === 'text') {
        if (channel.permissionsFor(bot.user).has('VIEW_CHANNEL') === true) {
          if (channel.permissionsFor(bot.user).has('SEND_MESSAGES') === true) {
            channel.send(
              `🥰 Thanks for being my friend. Visit xxx to start adding some Emojis! ❤️❤️❤️`
            );

            found = 1;
          }
        }
      }
    }
  });
});

bot.on('message', (msg) => {
  // if (msg.content === 'uwumoji') {
  //   msg.reply('hi ❤️');
  // }
  if (msg.content.includes('uwumoji')) {
    msg.reply('hi ❤️');
  }
});

// BOT EMOJI DUTIES
// All the duties of the bot
// Get info on guilds/emojis
// Add emojis
// Update emojis
// Delete emojis

// gets all guilds the bot is in
function getAllGuilds() {
  const allGuildIds = [];

  const allGuilds = bot.guilds.cache.forEach((guild) => {
    allGuildIds.push(guild.id);
  });

  // return the list of all guilds the bot is in
  return allGuildIds;
}

// gets emoji data by id
function getEmoji(emojiID) {
  return bot.emojis.cache.get(emojiID);
}

function getAllEmoji() {
  return bot.emojis.cache;
}

// gets all emoji per guild by guild id
function getGuildEmoji(guildID) {
  // get the emoji via guildID
  const guildEmoji = bot.guilds.cache.get(guildID);
  if (!guildEmoji) {
    // if empty return nothing
    return null;
  }
  // else get the emoji by each guild
  const emoji = guildEmoji.emojis.cache.map(function (emoji) {
    return { name: emoji.name, url: emoji.url, id: emoji.id };
  });

  return emoji;
}

// add the emoji to the guild
function addEmoji(guildID, url, name) {
  const guild = bot.guilds.cache.get(guildID);

  // get the first text channel in the guild
  const channel = guild.channels.cache
    .filter((ch) => ch.type === 'text')
    .find((c) => c.position === 0);

  // creat the emoji
  guild.emojis.create(url, name).catch(() => null);

  // calls the res+send function to prettify the emoji
  // and send it to the channel
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

  // sends a messge to the channel w/ the picture + name
  channel.send(`Emoji '${name}' added`, attachment);
}

// Updates an emoji
function updateEmoji(emojiID, newName) {
  // get emoji by ID
  const emoji = bot.emojis.cache.get(String(emojiID));

  // get the first text channel in the guild
  const channel = emoji.guild.channels.cache
    .filter((ch) => ch.type === 'text')
    .find((c) => c.position === 0);

  // sends a msg to the channel
  channel.send(`Emoji '${emoji.name}' renamed to '${newName}'`);

  // update the emoji name to the new name
  bot.emojis.cache.get(emojiID).edit({ name: newName });
}

// Deletes an Emoji
function deleteEmoji(emojiID) {
  // get emoji from by by ID
  const emoji = bot.emojis.cache.get(emojiID);

  // get the first text channel in the guild the emoji is in
  const channel = emoji.guild.channels.cache
    .filter((ch) => ch.type === 'text')
    .find((c) => c.position === 0);

  // sends a msg to the channel
  channel.send(`Emoji '${emoji.name}' deleted`);

  //deletes the emoji
  emoji.delete();
}

module.exports = {
  addEmoji,
  deleteEmoji,
  updateEmoji,
  getEmoji,
  getAllEmoji,
  getGuildEmoji,
  getAllGuilds,
};
