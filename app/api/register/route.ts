import { NextResponse,NextRequest } from "next/server";
import { z } from "zod";
import VerfyCodeModel from "@/Models/VerfyCode";
import UserModel from "@/Models/User";
import { connectDB } from "@/lib/mongodb";
let registerSchema = z.object({
    email: z.string().min(1, '請輸入電子郵件').email('電子郵件格式不符'),
    password: z.string().min(8, '密碼長度最少8位和最多16位').max(16, '密碼長度最少8位和最多16位').regex(/[A-Za-z]/, '需包含英、數及特殊符號').regex(/[0-9]/, '需包含英、數及特殊符號').regex(/[^A-Za-z0-9]/, '需包含英、數及特殊符號'),
    code: z.string({ message: "類型錯誤" })
})
type Register = z.infer<typeof registerSchema>

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        let registerData: Register = await req.json();
        let { email, password, code } = registerSchema.parse(registerData);

        //看帳號是否已註冊過
        let user = await UserModel.findOne({ email });
        if (user) {
            return NextResponse.json({
                code: 0,
                message: "帳號已存在",
                data: null
            })
        }

        //驗證信箱是否為真實信箱，用驗證碼來判斷
        let verfyCodeDoc = await VerfyCodeModel.findOne({ email, code });
        if (!verfyCodeDoc) {
            return NextResponse.json({
                code: 0,
                message: "驗證碼錯誤",
                data: null
            })
        }
        let expTime = new Date(verfyCodeDoc.expiresAt).getTime();
        if (Date.now() > expTime) {
            return NextResponse.json({
                code: 0,
                message: "驗證碼失效",
                data: null
            })
        }
        
        let CreateUser = new UserModel({
            email,
            password,
            nickName: email.split("@")[0]
        })
        await CreateUser.save();
        return NextResponse.json({
            code: 1,
            message: "註冊成功",
            data: null
        })
    }
    catch (e) {
        console.log("err", e)
        if (e instanceof z.ZodError) {
            return NextResponse.json({
                code: 0,
                message: e.issues[0].message,
                data: null
            })
        }

        return NextResponse.json({
            code: 0,
            message: e,
            data: null
        })
    }

}