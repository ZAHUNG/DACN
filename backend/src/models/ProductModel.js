const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true},
        image: { type: String, required: true, unique: true},
        type: { type: String, required: true},
        price: { type: Number, required: true},
        countInStock: { type: Number, required: true}, // số lượng còn trong kho
        rating: { type: Number, require: true},
        description: { type: String, required: true},
    },
    {
        timestamps: true,
    }
);
const User = mongoose.model("Product", productSchema);
module.exports = User;