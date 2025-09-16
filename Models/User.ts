import mongoose from "mongoose";
import bcrypt from "bcrypt"

let { Schema } = mongoose

let userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: {type: String, required: true},
    googleId: {type: String, default: ""},
    nickName: {type: String, required: true},
    avatar: {type: String, default: ""},
    points: {type: Number, default: 0}
},{
    timestamps: true
})

//比較密碼
userSchema.methods.comparePassword = async function(password: string){
   return await bcrypt.compare(password, this.password)
}

//middleware
userSchema.pre("save", async function(next) {
    let user = this;
    let hashPassword = await bcrypt.hash(user.password, 10);
    user.password = hashPassword;
    next();
})

let UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;