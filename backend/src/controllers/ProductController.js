const ProductService = require("../services/ProductService");

const createProduct = async(req, res) => {
    try {
        const { name, image, type, price, countInStock, rating, description } = req.body
        if (!name || !image || !type || !price || !countInStock || !rating) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await ProductService.createProduct(req.body)
        
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal Server Error'
        })
    }
}
const updateProduct = async(req, res) => {
    try {
        const productId = req.params.id
        const data = req.body
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.updateProduct(productId, data);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal Server Error'
        })
    }
} 

const getDetailsProduct = async(req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Product ID is required'
            })
        }
        const response = await ProductService.getDetailsProduct(productId);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal Server Error'
        })
    }
}
const deleteProduct = async(req, res) => {
    try {
        const productId = req.params.id
        const token = req.headers
        if(!productId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.deleteProduct(productId);
        return res.status(200).json(response)
    }catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async(req, res) => {
    try {
        const { limit = 8, page = 0 } = req.query;
        const response = await ProductService.getAllProduct(
            Number(limit),
            Number(page)
        );
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal Server Error'
        });
    }
} 

module.exports ={
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
}