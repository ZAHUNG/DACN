const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
    try {
        // console.log('req', req.body);
        const {paymentMethod, itemsPrice, shippingPrice, totalPrice, orderItems, shippingAddress} = req.body
        const userId = req.user.id;
        if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !orderItems || !shippingAddress || !userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }


        const response = await OrderService.createOrder({
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            orderItems,
            shippingAddress,
            user: userId  // gán user từ token
        });

        return res.status(200).json(response)
    } catch (e) {
        // console.error("❌ ERROR in createOrder:", e);
    return res.status(500).json({
        status: 'ERR',
        message: e.message || 'Internal Server Error'
        })
    }
}

const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'User ID is required'
            })
        }
        const response = await OrderService.getAllOrderDetails(userId);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal Server Error'
        })
    }
}

const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'User ID is required'
            })
        }
        const response = await OrderService.getDetailsOrder(orderId);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal Server Error'
        })
    }
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder
}