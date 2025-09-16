import { mkdir, writeFile } from "fs/promises";
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/Models/User";
export async function POST(req: NextRequest) {
    let token = await getToken({ req, secret: process.env.NEXTAUTH_JWT_KEY });
    //這邊判斷是因為執行getToken時，他會在執行nextauth的jwt callback，而jwt返回的值可能會包含token.error，所以需要判斷
    if (!token || token.error) {
        return NextResponse.json({
            code: 0,
            message: "token失效",
            data: null
        })
    }
    const formData = await req.formData();
    const avatar = formData.get('avatar') as File || null;
    const imageTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp"];
    const maxSize = 5242880; //5mb
    if (!avatar) {
        return NextResponse.json({ code: 0, message: "頭像上傳失敗", data: null })
    }
    if (!imageTypes.includes(avatar.type)) {
        return NextResponse.json({ code: 0, message: `圖片格式不支援，僅支援${imageTypes.join(',')}`, data: null })
    }
    if (avatar.size > maxSize) {
        return NextResponse.json({ code: 0, message: '檔案太大，需小於5MB', data: null })
    }

    const arrayBuffer = await avatar.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // 定義儲存路徑
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const fileName = `${Math.floor(Math.random() * 9999)}${Date.now()}${Math.floor(Math.random() * 9999)}.${avatar.type.split('/')[1]}`;
    const filePath = path.join(uploadDir, fileName)
    const publicPath = `/uploads/${fileName}`
    await writeFile(filePath, buffer)
    try {
        await connectDB();
        await UserModel.updateOne({_id: token.user?.id}, {avatar: publicPath}).exec();
    } catch (err) {
        return NextResponse.json({
            code: 0,
            message: err,
            data: null
        })
    }
    return NextResponse.json({
        code: 1,
        message: "頭像上傳成功",
        data: {
            imageURL: publicPath
        }
    })
}