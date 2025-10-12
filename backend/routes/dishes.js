const router = require("express").Router();
const controllers = require("../controllers/dishes");
const verifyToken = require("../middlewares/verifyToken");
router.get("/getAvailableDishes", controllers.getAvailableDishes);
router.get("/getAllDishes", verifyToken, controllers.getAllDishes);
router.get(
  "/getNotAvailableDishes",
  verifyToken,
  controllers.getNotAvailableDishes,
);
router.post("/addDish", verifyToken, controllers.addDish);
router.delete("/deleteDish", verifyToken, controllers.deleteDish);
router.put("/Available", verifyToken, controllers.Available);
router.put("/NotAvailable", verifyToken, controllers.NotAvailable);
module.exports = router;
