const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
    try {
        // console.log('req', req.body);
        const {paymentMethod, itemsPrice, shippingPrice, totalPrice, orderItems, shippingAddress, user} = req.body
        if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !orderItems || !shippingAddress || !user) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await OrderService.createOrder(req.body)

        return res.status(200).json(response)
    } catch (e) {
        // console.error("❌ ERROR in createOrder:", e);
    return res.status(500).json({
        status: 'ERR',
        message: e.message || 'Internal Server Error'
        })
    }
}

const getDetailsOrder = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'User ID is required'
            })
        }
        const response = await OrderService.getOrderDetails(userId);
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
    getDetailsOrder,
}