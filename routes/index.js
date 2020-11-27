const router = require('express').Router();

router.use("/", require("./public"));
router.use("/", require("./protected"));

module.exports = router;