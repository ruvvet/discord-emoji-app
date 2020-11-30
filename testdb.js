const db = require('./models');

const test='pzlir7890NAZ2Y2AjWFb1Ub5sv8tdg';

db.user
  .findOne({
    where: { access_token: test },
  })
  .then((foundUser) => {
    console.log(foundUser.get()); //just return the object
  });