const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Enter Product name"],
        trim:true
    },
    description:{
        type: String,
        required:[true,"Enter Product discription"]
    },
    price:{
        type: Number,
        required:[true,"Enter Product price"],
        maxlength:[8,"Price cannot exceed 8 character"]
    },
    ratings:{
        type: Number,
        default:0
    },
    images:[
        {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type: String,
            required:true
        }
        }],
    category:{
        type:String,
        required:[true,"Enter product category"],

    },
    Stock:{
        type:Number,
        required:[true,"Enter product stock"],
        maxlength:[4,"stock cannot exceed 4 character"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref: "User",
                required:true,
            },

            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true,
            },
            comment: {
                type:String,
                required: true
            }
        }
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref: "User",
        required:true,
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

})


module.exports = mongoose.model("Product",productSchema);