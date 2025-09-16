import { connectDB } from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import VerfyCodeModel from "@/Models/VerfyCode";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
    try {
        await connectDB()

        let { email } = await req.json()

        //生成驗證碼6位
        let code = Math.floor(100000 + Math.random() * 900000);
        let expTime = Date.now() + (5 * 60 * 1000);
        let expiresAt = new Date(expTime);
        //去判斷發送驗證碼的時間有沒有超過60秒，有才能再重新發送
        let doc = await VerfyCodeModel.findOne({ email })
        console.log("doc", doc)

        if (doc) {
            let sendDate = doc.createdAt === doc.updatedAt ? doc.createdAt : doc.updatedAt
            let sendTime = new Date(sendDate).getTime()
            let limitTime = 60000;
            let currentTime = Date.now();
            
            if (currentTime - sendTime < limitTime) {
                return NextResponse.json({
                    code: 0,
                    message: '發送驗證碼未超過1分鐘',
                    data: null
                })
            }
            await VerfyCodeModel.findOneAndUpdate({ _id: doc._id }, { code, expiresAt });

        } else {
            let verfyCode = new VerfyCodeModel({
                email,
                code,
                expiresAt
            })
            await verfyCode.save();
        }


        let resend = new Resend(process.env.RESEND_API_KEY);
        let { error } = await resend.emails.send({
            from: '驗證系統 <onboarding@resend.dev>',
            to: email,
            subject: "AIG 信箱驗證碼",
            html: `<div>您的信箱驗證碼為: ${code}</div>`
        })

        if (error) {
            console.log(error)
            return NextResponse.json({
                code: 0,
                message: '驗證碼發送失敗',
                data: null
            })
        }
        return NextResponse.json({
            code: 1,
            messagge: "驗證碼發送成功",
            data: null
        })
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            code: 0,
            messagge: "伺服器錯誤",
            data: null
        }, {
            status: 500
        })
    }
} 