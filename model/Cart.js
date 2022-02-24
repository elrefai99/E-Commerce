const {Schema, model} = require('mongoose');

const cartSchema = new Schema({
    userId:{
        type: String,
        required: true,
    },
    products:[
        {
            productsId:{
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
            },
        }
    ]
}, {timestamps: true});

module.exports = model('cart', cartSchema)