const db = require('./models');

const { COOKIE, oauth } = require('./constants');

console.log(COOKIE)

db.user
  .findOne({
    where: { access_token: user.access_token },
  })
  .then((foundUser) => {
    console.log(foundUser.get()); //just return the object
  });