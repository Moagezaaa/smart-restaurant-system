const admin = require("../controllers/admin");
const verifyToken = require("../middlewares/verifyToken");
router = require("express").Router();
router.post("/login",admin.login);
router.post("/logout",verifyToken,admin.logout);
module.exports = router;
