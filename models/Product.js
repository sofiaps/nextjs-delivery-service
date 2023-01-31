import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        maxlength: 250
    },
    category: {
        type: String,
        required: true,
        maxlength: 30
    },
    price: {
        type: Number,
        required: true,
    },
    url: {
        type: String,
        required: true,
        maxlength: 30,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    extras: {
        type: [
            {
                text: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
            }
        ]
    },
},
)

export default mongoose.models.Product || mongoose.model("Product", ProductSchema)