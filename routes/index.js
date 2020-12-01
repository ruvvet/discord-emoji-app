// MAIN ROUTER
// JUST REQUIRES PROTECTED + PUBLIC ROUTES

// DEPENDENCIES
const router = require('express').Router();

// MIDDLEWARE
router.use('/', require('./public'));
router.use('/', require('./protected'));

router.use(function (req, res, next) {
  res.status(404).render('./error/404');
});

router.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('./error/500');
});

module.exports = router;
