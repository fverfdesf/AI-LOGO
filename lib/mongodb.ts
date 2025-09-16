import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
    throw new Error('請在 .env 設定 MONGODB_URI')
}

export async function connectDB() {
    if ((global as any).conn) return (global as any).conn

    try{
        (global as any).conn = await mongoose.connect(MONGODB_URI)
        console.log("db connect success")
        return (global as any).conn
    }catch(e){
        console.log('db error', e)
        throw e
    }
}