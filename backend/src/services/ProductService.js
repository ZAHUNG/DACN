const Product = require('../models/ProductModel');


const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description, discount } = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The name of product is already'
                })
            }
            // console.log('hash', hash)
            const createdProduct = await Product.create({
                name, image, type, 
                countInStock: Number(countInStock),
                price, countInStock, rating, description, discount: Number(discount)
            })
            if (createdProduct) {
                resolve({
                    status: 'OK',
                    message: 'Create product successfully',
                    data: createdProduct
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'Product not found'
                })
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            if (updatedProduct) {
                resolve({
                    status: 'OK',
                    message: 'Product updated successfully',
                    data: updatedProduct
                })
            } else {
                resolve({
                    status: 'ERR',
                    message: 'Failed to update product'
                })
            }
            // }
        } catch (e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            // console.log('checkUser', checkUser)
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            const deleteProduct = await Product.findByIdAndDelete(id)
            // console.log('updateUser', updateUser)
            resolve({
                status: 'OK',
                message: ' Delete product success',
            })
            // }
        } catch (e) {
            reject(e)
        }
    })
}

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments();
            let allProduct = [];
            if(filter) {
                const label = filter[0];
                const allObjectFilter = await Product.find({ [label]: { $regex: filter[1] } }).limit(limit).skip(page * limit);
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }if (sort) {
                const objectSort = {}
                objectSort[sort[0]] = sort[1];
                const allObjectSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort);
                return resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allObjectSort,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if(!limit){
                allProduct = await Product.find()
            }else {
                allProduct = await Product.find().limit(limit).skip(page * limit);
            }
                    return resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allProduct,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            } catch (e) {
                reject(e)
            }
    })
}

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })
            if (!product) {
                resolve({
                    status: 'ERR',
                    message: 'Product not found'
                })
            } else {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: product
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const deleteMany = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedProducts = await Product.deleteMany({ _id: { $in: ids } })
            resolve({
                status: 'OK',
                message: 'Delete products success',
                data: deletedProducts
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const alltype = await Product.distinct("type");
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: alltype,
           })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteMany,
    getAllType
}