'use client'
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { FaXmark, FaGoogle, FaCircleXmark,FaCircleNotch } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/lib/hooks"
import { setIsShowLogin, setIsShowRegister } from "@/lib/slice/userSlice"
import { signIn, SignInResponse, useSession } from "next-auth/react";
import MsgAlert from "./MsgAlert";
//登入驗證
let loginSchema = z.object({
  email: z.string().min(1, '請輸入電子郵件').email('電子郵件格式不符'),
  password: z.string().min(1, '請輸入密碼')
})

//推導型別
type LoginVal = z.infer<typeof loginSchema>
const Login = () => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState } = useForm<LoginVal>({
    resolver: zodResolver(loginSchema),
  })
  const [loginError, setLoginError] = useState<SignInResponse | null>(null)
  const [isShowMsg, setIsShowMsg] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const loginSubmit = async (data: LoginVal) => {
    console.log(data);
    setIsLoading(true);
    let res = await signIn('credentials', { redirect: false, ...data })
    if (!res?.ok) {
      setLoginError(res as SignInResponse)
    }else{
      setLoginError(null)
    }
    setIsShowMsg(true)
    setIsLoading(false)
  }

  const closeLogin = () => {
    dispatch(setIsShowLogin(false));
  }

  const showRegister = () => {
    dispatch(setIsShowRegister(true));
    closeLogin()
  }

  const googleAuth = async (e: any) => {
    e.preventDefault();
    signIn('google', {
      callbackUrl: "/"
    })
  }

  return (
    <>
      {isShowMsg && loginError && <MsgAlert title={<span className="text-red-700">{loginError.error}</span>} setIsShowMsg={setIsShowMsg} icon={<FaCircleXmark className="!text-red-700"/>}/>}
      <div className="absolute left-0 top-0 bottom-0 right-0 bg-black/20" onClick={closeLogin}></div>
      <div className="absolute left-1/2 -translate-1/2 top-1/2  bg-background border border-solid border-gray-400 rounded-lg px-6 w-full max-w-sm">
        <div className="flex justify-center mt-4">
          <div className="flex items-center">
            <Image
              src="/images/logoipsum-396.png"
              alt="logo"
              width={200}
              height={200}
              className="w-10"
            />
            <span className="ml-1 font-bold text-xl">AIG</span>
          </div>
          <FaXmark className="absolute top-2 right-2 text-gray-600 text-xl cursor-pointer" onClick={closeLogin} />
        </div>
        <div className="text-muted-foreground mt-1 text-sm">歡迎回來!請先登入才能繼續</div>
        <Button variant="outline" className="cursor-pointer w-full mt-4" onClick={googleAuth}>
          <FaGoogle />
          <span>Google</span>
        </Button>
        <div className="w-full border border-solid my-6 relative before:content-['或'] before:absolute before:-translate-1/2 before:bg-background before:px-2"></div>
        <form onSubmit={handleSubmit(loginSubmit)}>
          <div className="flex flex-col text-left">
            <label htmlFor="email" className="text-sm">電子郵件</label>
            <input {...register('email')} type="text" id="email" placeholder="請輸入電子郵件" className="mt-1 border border-solid border-gray-400 rounded-sm px-2 p-1 placeholder:text-sm focus:outline-2 focus:border-primary" />
            <p className='text-sm text-destructive'>{formState.errors.email?.message}</p>
          </div>
          <div className="flex flex-col text-left mt-2">
            <label htmlFor="password" className="text-sm">密碼</label>
            <input {...register('password')} type="password" id="password" placeholder="請輸入密碼" className="mt-1 border border-solid border-gray-400 rounded-sm px-2 p-1 placeholder:text-sm focus:outline-2 focus:border-primary" />
            <p className='text-sm text-destructive'>{formState.errors.password?.message}</p>
          </div>
          <Button className={`w-full mt-4 cursor-pointer ${isLoading ? 'bg-primary/50 hover:bg-primary/50' : ''}`}>{isLoading ? [<FaCircleNotch className="animate-spin"/>, '登入中'] : '登入'}</Button>
        </form>
        <div className="py-2 text-sm">
          還沒有帳號?<span className="text-primary font-bold hover:underline cursor-pointer" onClick={showRegister}>註冊</span>
        </div>
      </div>
    </>

  );
};

export default Login;
