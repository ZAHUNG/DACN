const express = require("express");
const router = express.Router();
const PayPalController = require("../controllers/PayPalController");
const { authUserMiddlewear } = require("../middleware/authMiddlewear");

router.post("/create-order", authUserMiddlewear, PayPalController.createPayPalPayment);
router.post("/capture-order", authUserMiddlewear, PayPalController.capturePayPalPayment);

module.exports = router;