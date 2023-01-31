import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    customer: {
        type: String,
        required: true,
        maxlength: 100
    },
    address: {
        type: String,
        required: true,
        maxlength: 200
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        default: 0
    },
    payment: {
        type: Number,
        required: true
    },
    products: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                qty: {
                    type: Number,
                    required: true
                },
                extras: {
                    type: [
                        {
                            type: String
                        }
                    ]
                }
            }
        ]
    }
},
)
// delete mongoose.connection.model['Order'];
export default mongoose.models.Order || mongoose.model("Order", OrderSchema)