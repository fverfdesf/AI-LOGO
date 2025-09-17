"use client";
import React from "react";
import Layout from "@/components/Layout";
import Image from "next/image";
import { Button } from "./ui/button";
import { useAppDispatch } from "@/lib/hooks";
import { setIsShowLogin } from "@/lib/slice/userSlice";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
const Header = () => {
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  let avatarPath = "/images/logoipsum-396.png";
  if (session?.user?.image) avatarPath = session.user.image as string
  
  return (
    <div className="w-full shadow-[0_1px_1px] shadow-foreground/25 py-2 px-2 ">
      <Layout className="flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={()=>{router.push('/')}}>
          <Image
            src="/images/logoipsum-396.png"
            alt="logo"
            width={400}
            height={400}
            className="w-12 mr-2"
          />
          <span className="font-bold">LOGOTXT</span>
        </div>
        {
          status === 'authenticated' && !session.error &&
          <div className="w-12 h-12 rounded-full overflow-hidden mr-2 cursor-pointer relative" onClick={()=>{router.push('/user/profile')}}>
            <Image
              src={avatarPath}
              alt="logo"
              width={400}
              height={400}
              className="w-full"
            />
          </div>
        }
        {
          status === "authenticated" && session.error &&
          <Button
            className="font-bold cursor-pointer"
            onClick={() => dispatch(setIsShowLogin(true))}
          >
            登入
          </Button>
        }
        {
          status === "unauthenticated" &&
          <Button
            className="font-bold cursor-pointer"
            onClick={() => dispatch(setIsShowLogin(true))}
          >
            登入
          </Button>
        }
      </Layout>
    </div>
  );
};

export default Header;
