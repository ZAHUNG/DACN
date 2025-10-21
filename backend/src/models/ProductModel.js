const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true},
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        images: { type: String, required: true, unique: true},
        type: { type: String, required: true},
        price: { type: Number, required: true},
        countInStock: { type: Number, required: true},
        // rating: { type: Number, required: true},
        description: { type: String },
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // tham chiếu tới ReviewModel
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;