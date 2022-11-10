const express = require("express");
const router = express.Router();

const controller = require("../controllers/orders.controller");
const authJwt = require("../middleware/verifySignedIn");

router.post("/add-order", controller.CreateOrder);
router.post("/get-order", controller.GetOrders);

module.exports = router;
