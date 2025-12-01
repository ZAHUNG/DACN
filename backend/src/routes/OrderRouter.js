const express = require("express");
const router = express.Router()
const OrderController = require("../controllers/OrderController");
const { authUserMiddlewear } = require("../middleware/authMiddlewear");

router.post('/create', authUserMiddlewear, OrderController.createOrder);
router.get('/get-all-order/:id', authUserMiddlewear,OrderController.getAllOrderDetails);
router.get('/get-details-order/:id', authUserMiddlewear,OrderController.getDetailsOrder);
router.delete('/cancel-order/:id', authUserMiddlewear,OrderController.cancelOrderDetails);

module.exports = router;