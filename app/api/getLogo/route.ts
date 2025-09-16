import { NextResponse, NextRequest } from "next/server";
import AILogoModel from "@/Models/AILogo";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/mongodb";
export async function GET(req: NextRequest) {
    let token = await getToken({ req, secret: process.env.NEXTAUTH_JWT_KEY });
    //這邊判斷是因為執行getToken時，他會在執行nextauth的jwt callback，而jwt返回的值可能會包含token.error，所以需要判斷
    if (!token || token.error) {
        return NextResponse.json({
            code: 0,
            message: "token失效",
            data: null
        })
    }
    let searchParams = req.nextUrl.searchParams;
    let page = Number(searchParams.get('page')) || 1;
    let dataCount = Number(searchParams.get('dataCount')) || 50;
    let startDataIndex = (page - 1) * dataCount
    try {
        await connectDB();
        let logoTotal = await AILogoModel.countDocuments({ userId: token?.user?.id }).exec();
        let logoData: any[] = [];
        if (logoTotal > 0) {
             logoData = await AILogoModel.find({ userId: token?.user?.id }).sort({ createdAt: -1 }).skip(startDataIndex).limit(dataCount).select('imageUrl').lean().exec();
        }
        return NextResponse.json({
            code:1,
            message:"獲取成功",
            data:{
                totalPage: Math.ceil(logoTotal / dataCount),
                currentPage: page,
                logoTotal,
                logoData
            }
        })
    } catch (err) {
        console.log('資料庫錯誤', err)
        return NextResponse.json({ code: 0, message: "伺服器錯誤", data: null })
    }



}