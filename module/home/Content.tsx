"use client";
import React from "react";
import MainTitle from "./MainTitle";
import SubTitle from "./SubTitle";
import { Button } from "@/components/ui/button";
import Login from "@/components/Login";
import Register from "@/components/Register";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setIsShowLogin } from "@/lib/slice/userSlice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TokenInvalid from '@/components/tokenInvalid';
import useTokenInvalid from "@/hooks/useTokenInvalid";
const Content = () => {
  const { data } = useSession()
  const isTokenInvalid = useAppSelector(state => state.userReducer.isTokenInvalid)
  const router = useRouter()
  const isShowLogin = useAppSelector(state => state.userReducer.isShowLogin);
  const isShowRegister = useAppSelector(
    state => state.userReducer.isShowRegister
  );
  const dispatch = useAppDispatch();
  useTokenInvalid({})
  const startGenerate = () => {
    if (data?.user) {
      return router.push("/create")
    }
    dispatch(setIsShowLogin(true))
  }
  return (
    <div className="text-center">
      {isTokenInvalid && <TokenInvalid />}
      <MainTitle />
      <SubTitle />
      <Button
        className="cursor-pointer mt-10 text-2xl px-10 py-6"
        onClick={startGenerate}
      >
        開始生成
      </Button>
      {isShowLogin && <Login />}
      {isShowRegister && <Register />}
    </div>
  );
};

export default Content;
