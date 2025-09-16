import mongoose from "mongoose";
import bcrypt from "bcrypt"

let { Schema } = mongoose

let aiLogoSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

let AILogoModel = mongoose.models.AILogo || mongoose.model('AILogo', aiLogoSchema);

export default AILogoModel;