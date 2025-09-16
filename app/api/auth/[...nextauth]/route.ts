import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/Models/User";
import jwt from 'jsonwebtoken';
import { MongooseError } from "mongoose";
import getAccessToken from "@/lib/getAccessToken";
let handler = NextAuth({
  secret: process.env.NEXTAUTH_JWT_KEY,
  providers: [
    CredentialsProvider({
      name: "登入",
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' }
      },
      authorize: async function (credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("欄位錯誤")
          }
          await connectDB();
          let { email, password } = credentials;

          let user = await UserModel.findOne({ email });
          if (!user) {
            throw new Error("帳號不存在")
          }

          if (!await user.comparePassword(password)) {
            throw new Error("帳號或密碼錯誤")
          }

          return {
            id: user._id,
            email: user.email,
            name: user.nickName,
            image: user.avatar
          }
        }
        catch (e) {
          console.log(e)
          if (e instanceof MongooseError) {
            console.log(e)
            throw new Error("伺服器錯誤")
          }
          throw e
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      console.log("觸發signIn回調")
      if (account?.provider === "google") {
        try {
          await connectDB();
          let UserDoc = await UserModel.findOne({ email: user.email })
          if (!UserDoc) {
            let randomPassword = Math.floor(Math.random() * 999999999) + (process.env.PASSWORD_SUFFIX as string);
            let insertUserData = { email: user.email, googleId: user.id, password: randomPassword, nickName: user.name, avatar: user.image }
            let userData = await new UserModel(insertUserData).save();
            user.id = userData._id;
            user.image = userData.avatar;
            user.name = userData.nickName;
            user.email = userData.email
            return true;
          }
          //判斷是不是用google創建的帳號
          if (UserDoc.googleId === "") {
            user.id = UserDoc._id;
            user.image = UserDoc.avatar;
            user.name = UserDoc.nickName;
            user.email = UserDoc.email
          }
        } catch (e) {
          return false
        }
      }
      return true
    },
    jwt: async ({ token, user, account, trigger, session }) => {
      console.log("觸發jwt回調")
      console.log("token", token)
      if (user) {
        let accessToken = jwt.sign(user, process.env.JWT_KEY as string, { expiresIn: "1m" })
        let refreshToken = jwt.sign(user, process.env.JWT_KEY as string, { expiresIn: "2m" })
        token = {...token, accessToken, refreshToken, user}
        return token
      }
      if (token.error) {
        return token;
      }
      if(trigger === "update" && session && token.user){
        token.user = {...token.user, ...session}
         return token
      }
      try {
        let payload = jwt.verify(token.accessToken as string, process.env.JWT_KEY as string)
        return token;
      } catch (e) {
        let { accessToken, error } = await getAccessToken(token.refreshToken as string);
        if (error) {
          token = {
            error
          }
          return token;
        }
        token.accessToken = accessToken;
        return token
      }
    },
    session: ({ session, token }) => {
      console.log("session callback token", token)
      console.log('session callback session', session)
      console.log("觸發session回調")
       if (token.error) {
        session.error = token.error as string;
      }
      if (token.user) session.user = token.user

      return session;
    }
  },
  pages: {
    signIn: "/",
    error: "/"
  }
});

export { handler as GET, handler as POST }