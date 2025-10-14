const router = require("express").Router();
const orderController = require("../controllers/orders");
router.post("/createOrder", orderController.createOrder);
router.delete("/deleteOrder", orderController.deleteOrder);
router.get("/gettableOrders", orderController.gettableOrders);
module.exports = router;