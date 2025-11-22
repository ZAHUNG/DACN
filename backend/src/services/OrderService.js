const Order = require('../models/OrderProduct');
const bcrypt = require('bcrypt');
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService');


const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.create(newOrder); // lưu vào DB
            resolve(order); // trả về cho frontend
        } catch (error) {
            // console.error("❌ ERROR in OrderService createOrder:", error);
            reject(error); // nếu lỗi thì reject
        }
    })
}

module.exports = {
    createOrder,
}