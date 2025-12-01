const { createPayPalOrder, capturePayPalOrder } = require("../services/PaypalService");
const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");

const createPayPalPayment = async (req, res) => {
  try {
    const orderData = req.body;
    
    if (!orderData.orderItems || !orderData.shippingAddress || !orderData.totalPrice) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing required order data",
      });
    }

    const response = await createPayPalOrder(orderData);
    
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Failed to create PayPal payment",
    });
  }
};

const capturePayPalPayment = async (req, res) => {
  try {
    const { orderID, orderData } = req.body;
    const userId = req.user.id;

    if (!orderID) {
      return res.status(400).json({
        status: "ERR",
        message: "OrderID is required",
      });
    }

    const paymentResponse = await capturePayPalOrder(orderID);

    // If payment is captured successfully, create order in database
    if (paymentResponse.status === "OK") {
      const { orderItems, shippingAddress, itemsPrice, shippingPrice, totalPrice } = orderData;

      // Update product stock
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate({
          _id: order.product,
          countInStock: { $gte: order.amount }
        },
        {
          $inc: {
            countInStock: -order.amount,
            selled: +order.amount
          }
        },
        { new: true }
        );
        
        if (productData) {
          return {
            status: 'Ok',
            message: 'SUCCESS'
          };
        } else {
          return {
            status: 'ERR',
            message: 'Not enough stock',
            id: order.product
          };
        }
      });

      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item.status === 'ERR');
      
      if (newData.length) {
        return res.status(400).json({
          status: 'ERR',
          message: `Some products don't have enough stock`
        });
      }

      const createOrderResponse = await Order.create({
        orderItems,
        shippingAddress,
        paymentMethod: "paypal",
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: userId,
        isPaid: true,
        paidAt: new Date(),
        paypalOrderId: orderID,
      });

      return res.status(200).json({
        status: "OK",
        message: "Payment captured and order created successfully",
        data: createOrderResponse,
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Failed to capture PayPal payment",
    });
  }
};

module.exports = {
  createPayPalPayment,
  capturePayPalPayment,
};