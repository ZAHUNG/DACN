const Order = require('../models/OrderProduct');
const Product = require('../models/ProductModel');
const bcrypt = require('bcrypt');
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService');


const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
       const {paymentMethod, itemsPrice, shippingPrice, totalPrice, orderItems, shippingAddress, user} = newOrder
       try{
        // console.log('orderItems', {orderItems})
        const promises = orderItems.map(async (order) =>{
            const productData = await Product.findOneAndUpdate({
            _id: order.product,
            countInStock: {$gte: order.amount}
            },
        {
            $inc:{
                countInStock: -order.amount,
                selled: +order.amount
            }
        },
            {new: true}
        )
        console.log('productData',productData);
            if(productData){
                const createOrder = await Order.create({
                orderItems,
                shippingAddress,
                paymentMethod, itemsPrice, shippingPrice, totalPrice, user           
            })
            if(createOrder){
                return{
                    status: 'Ok',
                    message: 'SUCCESS'
                }
            }else{
                return{
                    status: 'Ok',
                    message: 'ERR',
                    id: order.product
                }
            }
        }
            })
        const results = await Promise.all(promises);
        const newData = results && results.filter((item) => item.id)
        if(newData.length) {
            resolve({
                status: 'Ok',
                message: `San pham voi id${newData.join(',')} khong du hang`
            })
        }
        resolve({
            status:'Ok',
            message:'SUCCESS'
        })
       }catch(e){
        reject(e);
       }
    })
}

module.exports = {
    createOrder,
}