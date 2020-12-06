// MAIN ROUTER
// REQUIRES PROTECTED + PUBLIC ROUTES
// HANDLES THE 404 + 500 ERRORS

// DEPENDENCIES //////////////////////////////////////////////////////////
const router = require('express').Router();

// MIDDLEWARE ////////////////////////////////////////////////////////////
router.use('/', require('./public'));
router.use('/', require('./protected'));

// ROUTES ////////////////////////////////////////////////////////////////
router.use(function (req, res, next) {
  res.status(404).render('./error/404');
});

router.use(function (err, req, res, next) {
  res.status(500).render('./error/500');
});

module.exports = router;
