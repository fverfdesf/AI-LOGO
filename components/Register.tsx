'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "./ui/button";
import { FaXmark, FaGoogle } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/lib/hooks"
import { setIsShowLogin, setIsShowRegister } from "@/lib/slice/userSlice"
import { useSendCodeMutation } from '@/lib/api/userApi';
import MsgAlert from './MsgAlert';
import { FaCircleXmark, FaCircleCheck } from "react-icons/fa6";
import { useRegisterMutation } from '@/lib/api/userApi';
//註冊驗證
let registerSchema = z.object({
  email: z.string().min(1, '請輸入電子郵件').email('電子郵件格式不符'),
  code: z.string().min(6, '請輸入6位驗證碼').max(6, '請輸入6位驗證碼'),
  password: z.string().min(8, '密碼長度最少8位和最多16位').max(16, '密碼長度最少8位和最多16位').regex(/[A-Za-z]/, '需包含英、數及特殊符號').regex(/[0-9]/, '需包含英、數及特殊符號').regex(/[^A-Za-z0-9]/, '需包含英、數及特殊符號'),
  confirmPassword: z.string(),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
  message: '二次密碼不一致',
  path: ['confirmPassword']
})

//推導型別
type RegisterVal = z.infer<typeof registerSchema>

const Register = () => {
  const dispatch = useAppDispatch();
  const [sendCode] = useSendCodeMutation();
  const [userRegister, { data: resRegisterData, isLoading: registerLoading }] = useRegisterMutation();
  const [isShowCodeMsg, setIsShowCodeMsg] = useState<boolean>(false);
  const [isShowRegisterMsg, setIsShowRegisterMsg] = useState<boolean>(false);
  const [codeErrorMsg, setErrorMsg] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const { register, handleSubmit, formState } = useForm<RegisterVal>({
    resolver: zodResolver(registerSchema),
  })
  console.log('resRegisterData', resRegisterData)
  const registerSubmit = async (data: RegisterVal) => {
    //註冊會員帳號
    console.log(data)
    let { email, password, code } = data
    let reqData = { email, password, code }
    await userRegister(reqData).unwrap()
    setIsShowRegisterMsg(true);
  }

  const closeRegister = () => {
    dispatch(setIsShowRegister(false));
  }

  const showLogin = () => {
    dispatch(setIsShowLogin(true));
    closeRegister()
  }

  const getEmailCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (countdown !== null) return '';
    let emailInut = document.querySelector('#email') as HTMLInputElement;
    let emailSchema = z.string().email('無效的電子郵件');
    let validateResult = emailSchema.safeParse(emailInut?.value);
    if (validateResult.success) {
      let res = await sendCode({ email: emailInut.value }).unwrap();
      setIsShowCodeMsg(true);
      if (res.code) {
        setErrorMsg(null)
        setCountdown(60)
      } else {
        setErrorMsg('獲取失敗')
      }
    } else {
      setIsShowCodeMsg(true);
      setErrorMsg(validateResult.error.issues[0].message)
    }
  }

  useEffect(() => {
    if (countdown !== null) {
      let timer = setTimeout(() => {
        if (countdown === 0) {
          setCountdown(null)
        } else {
          setCountdown(countdown - 1)
        }
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [countdown])

  return (
    <>
      {isShowCodeMsg && codeErrorMsg && <MsgAlert title={<span className='text-red-700'>{codeErrorMsg}</span>} setIsShowMsg={setIsShowCodeMsg} icon={<FaCircleXmark className="!text-red-700" />} />}
      {isShowCodeMsg && !codeErrorMsg && <MsgAlert title={<span className='text-green-700'>獲取成功</span>} setIsShowMsg={setIsShowCodeMsg} icon={<FaCircleCheck className="!text-green-700" />} />}
      {isShowRegisterMsg && resRegisterData?.code === 1 && <MsgAlert title={<span className='text-green-700'>註冊成功</span>} setIsShowMsg={setIsShowRegisterMsg} icon={<FaCircleCheck className="!text-green-700" />} />}
      {isShowRegisterMsg && resRegisterData?.code === 0 && <MsgAlert title={<span className='text-red-700'>{resRegisterData.message}</span>} setIsShowMsg={setIsShowRegisterMsg} icon={<FaCircleXmark className="!text-red-700" />} />}
      <div className="absolute left-0 top-0 bottom-0 right-0 bg-black/20" onClick={closeRegister}></div>
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
          <FaXmark className="absolute top-2 right-2 text-gray-600 text-xl cursor-pointer" onClick={closeRegister} />
        </div>
        <Button variant="outline" className="cursor-pointer w-full mt-4">
          <FaGoogle />
          <span>Google</span>
        </Button>
        <div className="w-full border border-solid my-6 relative before:content-['或'] before:absolute before:-translate-1/2 before:bg-background before:px-2"></div>
        <form onSubmit={handleSubmit(registerSubmit)}>
          <div className="flex flex-col text-left">
            <label htmlFor="email" className="text-sm">電子郵件</label>
            <input {...register('email')} type="text" id="email" placeholder="請輸入電子郵件" className="mt-1 border border-solid border-gray-400 rounded-sm px-2 p-1 placeholder:text-sm focus:outline-2 focus:border-primary" />
            <p className='text-sm text-destructive'>{formState.errors.email?.message}</p>
          </div>
          <div className="flex flex-col text-left mt-2 relative">
            <label htmlFor="code" className="text-sm">驗證碼</label>
            <div className='flex items-center'>
              <input {...register('code')} type="text" id="code" placeholder="請輸入信箱驗證碼" className="grow border border-solid border-gray-400 rounded-sm px-2 p-1 placeholder:text-sm focus:outline-2 focus:border-primary" />
              <Button variant='outline' className={`cursor-pointer ml-2 ${countdown !== null ? "opacity-50 cursor-auto hover:bg-transparent" : ""}`} onClick={getEmailCode}>{countdown !== null ? [countdown, ' s'] : '獲取驗證碼'}</Button>
            </div>
            <p className='text-sm text-destructive'>{formState.errors.code?.message}</p>
          </div>
          <div className="flex flex-col text-left mt-2">
            <label htmlFor="password" className="text-sm">密碼</label>
            <input {...register('password')} type="password" id="password" placeholder="請輸入密碼" className="mt-1 border border-solid border-gray-400 rounded-sm px-2 p-1 placeholder:text-sm focus:outline-2 focus:border-primary" />
            <p className='text-sm text-destructive'>{formState.errors.password?.message}</p>
          </div>
          <div className="flex flex-col text-left mt-2">
            <label htmlFor="confirmPassword" className="text-sm">確認密碼</label>
            <input {...register('confirmPassword')} type="password" id="confirmPassword" placeholder="請輸入密碼" className="mt-1 border border-solid border-gray-400 rounded-sm px-2 p-1 placeholder:text-sm focus:outline-2 focus:border-primary" />
            <p className='text-sm text-destructive'>{formState.errors.confirmPassword?.message}</p>
          </div>
          <Button className="w-full mt-4 cursor-pointer">註冊</Button>
        </form>
        <div className="py-2 text-sm">
          已經有帳號?<span className="text-primary font-bold hover:underline cursor-pointer" onClick={showLogin}>登入</span>
        </div>
      </div>
    </>
  )
}

export default Register