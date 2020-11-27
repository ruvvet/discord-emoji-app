require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content === 'hi') {
    msg.reply('nou');
    msg.channel.send('hello');
  }

});



bot.on('message', msg=>{
    if (msg.content === 'emoji') {
    msg.channel.send('adding an emoji');


    const guild = bot.guilds.cache.get("781353966574370816");

    const url='https://emoji.gg/assets/emoji/9410_homu_brb.png';
    const name='boba';

    guild.emojis.create(url, name).then(emoji=>console.log('created new emoji')).catch(console.error);
    }
    

})

