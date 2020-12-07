# UwuMoji (and UwuMoji Bot)
## Discord Emoji Manager 🙂
A web app that lets you upload or select, edit, and add emojis from various libraries to you Discord server via the UwuMoji Bot.

## UwuMoji Bot 🤖
`UwuMoji bot` is 'U' to the 'WU' of the `UwuMoji app`. Invite UwuMoji Bot to your server when you login and it will add, edit, update, and delete your Emoji's for you when you manage them on the UwuMoji app website.

## Instructions:
> 1.  Installation: No installation needed.
> 2.  Visit [UwuMoji](https://uwumoji.herokuapp.com/)
> 3.  Login and authorize with your`Discord Account`.
> 4.  Select a server in which to authorize `uwumoji bot`.
> 5.  Main Page: See the guilds you are the owner of and the emojis for each guild.
> 6.  Upload Page: Upload a new emoji from your PC and add it to your server.
> 7.  Browse Page: Browse emojis from the UwuMoji Database, other servers UwuMoji Bot is a member of, and the [Emoji.gg emoji library](https://emoji.gg)
> 8.  Click an Emoji in the main page to delete it, edit the name, or add tags to the emoji.

### APIs:

> - 🎮 [Discord API](https://discord.com/developers/applications)
> - 😊 [Emoji.gg API](https://emoji.gg/developer)
> - ☁️ [Cloudinary API](https://cloudinary.com/documentation)

### Packages:
> - `axios`
> - `body-parser`
> - `canvas`
> - `cloudinary` : used to upload files to Cloudinary + access them w/ the API
> - `cookie-parser`
> - `discord-oauth2` : used for Discord Authorization
> - `discord.js` : used for the Discord Bot
> - `dotenv`
> - `ejs`
> - `express`
> - `express-ejs-layouts`
> - `multer`
> - `pg`
> - `qs`
> - `sequelize`
> - `sequelize-cli`
> - `uuid` : used to create a unique ID value

# SCREENSHOTS

## Web App
##### Login, Authorization, Home Page
![Authorization](https://github.com/ruvvet/discord-emoji-app/blob/main/public/img/ss/auth.gif)

##### Uploading an Emoji
![Upload](https://github.com/ruvvet/discord-emoji-app/blob/main/public/img/ss/upload.gif)

##### Browsing + Adding an Emoji
![Browse](https://github.com/ruvvet/discord-emoji-app/blob/main/public/img/ss/browse.gif)

##### Editing an Emoji
![Edit](https://github.com/ruvvet/discord-emoji-app/blob/main/public/img/ss/edit.gif)

##### Deleting an Emoji
![Delete](https://github.com/ruvvet/discord-emoji-app/blob/main/public/img/ss/delete.gif)


## Discord

##### Discord bot adding emojis
![Delete](https://github.com/ruvvet/discord-emoji-app/blob/main/public/img/ss/discord-upload.png)

##### Discord bot updating emojis
![Delete](https://github.com/ruvvet/discord-emoji-app/blob/main/public/img/ss/discord-update.png)


# CODE SNIPPETS

### Routers in Routes in Routes
By organizing all the routes within the Routes folder, `server.js`'s only responsibility is to listen + wrap the entire app.

Within the Router folder, the `index.js` acts as a wrapper for the public + protected routes, and app-wide handling of 404 + 500 errors.

The `public.js` and `protected.js` routes allow middleware to be set on the protected routes and any subsequent child routers which pass through `protected.js` to ensure you are logged in to be able to see protected pages. Public routes (such as `login` don't need the middleware and are accessible by anyone and everyone.)

`browse.js` and `create.js` are for organization purposes used to organize different routes by functionality.

```text
🗃️ Server (Primary App)
 ├─── 🗂️ Routes Folder (Collection of all the Routers)
      ├───── 📂 Index Router (Handles 404s + 500s)
              ├───── 📂 Public Router (Routes don't require login)
              ├───── 📂 Protected Router (Routes require login)
                      ├───── 📂 Browse Router (Browsing emoji routes)
                      ├───── 📂 Create Router (Create/add/edit emoji routes)
```

### Here's a 🍪: Discord Oauth, the UwuMoji Session, and the UwuMoji Cookie

Discord authorization requires you to log in w/ your Discord account. Upon successfully logging in, an `access token` is then sent back. If you are logging in for the first time, a `UUID (universally unique id)` is created for you. This is saved alongside your Discord access token in the database.

```javascript
// getting the user's access token from discord
const userAuth = await oauth
    .tokenRequest({
      code: req.query.code,
      scope: 'identify email guilds bot',
      grantType: 'authorization_code',
    })
    .catch(console.log);

//look up the discord id
const userInfo = await oauth.getUser(userAuth.access_token);

// find or create user in the db
const [user, created] = await db.user.findOrCreate({
    //...
},
});

```

To create a session, you get a cookie 🍪 w/ your UUID. You keep this uwumoji cookie 🍪 until you log out or lose it (delete it/eat it).

```javascript
// send a cookie that contains their uuid
res.cookie(COOKIE, user.uuid, { maxAge });
```

Since discord's access token expires every 7 days, to maintain your access we calculate the time until expiration and check it each time we validate. When there's one day left until the expiration date, we request a new access token for you.

```javascript

      if (daysUntilExpire < 1) {
        refreshToken(req.user);
      }
      next();
    } else {
      res.redirect('/login');
```

Every route/page you visit, we check your cookie and validate that your cookie that contains your UUID to see if you exist in the database. If your UUID does not pass the check, you will be redirected to log in.

```javascript
// validate their uuid when visiting a page - the validation middleware
async function validate(req, res, next) {
    //...
    // check the user's uuid against their cookie
    const user = await db.user
        .findOne({ where: { uuid: req.cookies[COOKIE] } })
        .catch(() => null);
        //...
    if (user) {
        // set req.user as the user details obj
        req.user = user;
        //...
    } else {
        res.redirect('/login');
    }
    //...
}
```
### Protecting the 'Protected' Routes

The `protected.js` router gatekeeps and manages any routes inside protected and its children routers. If you are not logged in, you get redirected to the login page.

This is accomplished through the use of the cookie (as explained above).

```javascript
// every route passed through here goes through the middleware
router.use(validate);
```

### Activating UwuMoji Bot 🤖 from the Web App
UwuMoji Bot `connects` and carries out actions you take on the web in your Discord Server.

Through interacting with different routes/elements in the UwuMoji Web App, the bot is directed to execute various commands in your Discord server on your behalf.

UwuMoji Bot's responsibilities on your Discord Server:
- `Add` emojis to your Discord Server through local uploads or from selecting an emojis through any Emoji libraries
- `Edit` the names of Emojis on your Discord servers
- `Delete` Emojis from your Discord Servers
- `Notify` you when any changes to emojis are made

UwuMoji Bot's other duties:
- gets all the guilds (aka servers) the bot is a member of
- gets all the emoji in all the guilds the bot is a member of
- gets the data of an emoji
- being 'uwu'-cute ❤️

```javascript
// add the emoji to the guild
function addEmoji(guildID, url, name) {
  const guild = bot.guilds.cache.get(guildID);
    //...

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

    //...
  // sends a messge to the channel w/ the picture + name
  channel.send(`Emoji '${name}' added`, attachment);
}

```

## THOUGHTS/REFLECTIONS

>1. Figuring out how to control the Bot through actions on the web was a great learning experience. While it was a bit difficult to understand and implement the process at first, once a system was established it became much easier to integrate the bot into the web app.
>2. The organization and control of my routers and middleware and how they each play into various security checks and validation processes was also one of the learning experiences that I think was extremely valuable for this project.
>3. Learning how to integrate Oauth into the web app was great in learning how cookies, sessions, refresh tokens, and authorization worked on a very basic level outside of the passport library.
>4. There are still many improvements and additions I want to continue making with this app.
