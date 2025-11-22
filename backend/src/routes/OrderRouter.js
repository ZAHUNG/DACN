const express = require("express");
const router = express.Router()
const OrderController = require("../controllers/OrderController");
const { authUserMiddlewear } = require("../middleware/authMiddlewear");

router.post('/create', authUserMiddlewear, OrderController.createOrder);


module.exports = router;