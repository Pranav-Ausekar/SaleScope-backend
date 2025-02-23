import mongoose from "mongoose";

const productSehema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    image: {
        type: String
    },
    sold: {
        type: Boolean,
    },
    dateOfSale: {
        type: Date,
        required: true
    }
})

const Product = mongoose.model('Product', productSehema);

export default Product;