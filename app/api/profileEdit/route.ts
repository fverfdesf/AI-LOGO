import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
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

    let {nickName: newNickName} = await req.json()
    let userDoc = await UserModel.findById(token?.user?.id).exec();
    let isEdit = true;
    if(!userDoc) isEdit = false;
    if(userDoc && userDoc.nickName === newNickName) isEdit = false
    if(isEdit){
        console.log("更新資料")
       await UserModel.updateOne({_id: userDoc._id}, {nickName: newNickName}).exec();
    }
    return NextResponse.json({
        code:1,
        message: "修改成功",
        data: {
            newNickName
        }
    })
}