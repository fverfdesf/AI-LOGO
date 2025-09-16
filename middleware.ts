import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
export default withAuth(async function middleware(req) {
  let token = await getToken({ req, secret: process.env.NEXTAUTH_JWT_KEY });
  //這邊判斷是因為執行getToken時，他會在執行nextauth的jwt callback，而jwt返回的值可能會包含token.error，所以需要判斷
  if (!token || token.error) {
    return NextResponse.json({
      code: 0,
      message: "token失效",
      data: null
    })
  }
  return NextResponse.next();
}, {
  callbacks: {
    authorized: ({ token }) => !!token
  },
  secret: process.env.NEXTAUTH_JWT_KEY
});

export const config = {
  matcher: ["/api/generateLogo", "/api/avatarUpload", "/api/getLogo"]
}