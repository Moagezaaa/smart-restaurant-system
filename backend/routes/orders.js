const router = require("express").Router();
const orderController = require("../controllers/orders");
const verifyToken = require("../middlewares/verifyToken");
router.post("/createOrder", orderController.createOrder);
router.delete("/deleteOrder", orderController.deleteOrder);
router.get("/gettableOrders", verifyToken,orderController.gettableOrders);
module.exports = router;