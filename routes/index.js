// MAIN ROUTER
// JUST REQUIRES PROTECTED + PUBLIC ROUTES

// DEPENDENCIES
const router = require('express').Router();

// MIDDLEWARE
router.use("/", require("./public"));
router.use("/", require("./protected"));

module.exports = router;