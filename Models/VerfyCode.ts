import mongoose from "mongoose";

let { Schema } = mongoose

let verfyCodeSchema = new Schema({
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }
},{
    timestamps: true
})

let VerfyCodeModel = mongoose.models.VerfyCode || mongoose.model('VerfyCode', verfyCodeSchema);

export default VerfyCodeModel;