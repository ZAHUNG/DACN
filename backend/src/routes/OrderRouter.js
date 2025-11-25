const express = require("express");
const router = express.Router()
const OrderController = require("../controllers/OrderController");
const { authUserMiddlewear } = require("../middleware/authMiddlewear");

router.post('/create', authUserMiddlewear, OrderController.createOrder);
router.get('/order-details/:id', OrderController.getDetailsOrder);

module.exports = router;