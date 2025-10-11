const admin = require("../controllers/admin");
router = require("express").Router();
router.post("/login",admin.login);
module.exports = router;
