import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        let { refreshToken } = await req.json();
        if (!refreshToken) {
            return NextResponse.json({
                code: 0,
                meesage: "refreshToken欄位為必填",
                data: null
            })
        }

        let payload = jwt.verify(refreshToken, process.env.JWT_KEY as string);
        let accessToken = jwt.sign(payload, process.env.JWT_KEY as string);
        return NextResponse.json({
            code: 1,
            message: "accessToken創建成功",
            data: {
                accessToken
            }
        })
    }
    catch (e) {
        return NextResponse.json({
            code: 0,
            message: e,
            data: null
        })
    }

}