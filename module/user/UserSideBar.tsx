'use client'
import React from 'react'
import Image from 'next/image'
import { FaUserPen, FaFileImage } from "react-icons/fa6";
import { useSession } from 'next-auth/react';
import { Skeleton } from "@/components/ui/skeleton"
import {useRouter, usePathname} from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
const UserSideBar = () => {
  let router = useRouter();
  let pathName = usePathname()
  let paths = pathName.split('/')
  let lastPath = paths[paths.length - 1];
  let { data } = useSession();
  let avatarPath = "/images/logoipsum-396.png";
  if (data?.user?.image) avatarPath = data.user.image as string
  
  return (
    <aside className='pt-5 px-4 border-r border-l border-black/15 text-foreground'>
      <div className='flex items-center border-b border--black/20 pb-4'>
        <div className='overflow-hidden w-10 h-10 rounded-full flex items-center justify-center'>
          {data?.user ? <Image src={avatarPath} alt="avatar" width={400} height={400} className='max-w-full align-middle'></Image> : <Skeleton className='w-10 h-10 mb-1' />}

        </div>
        <div className='ml-2 leading-[1.2]'>
          {data?.user?.name ? <div className=''>{data.user.name}</div> : <Skeleton className='w-[100px] h-5 mb-1' />}
          {data?.user?.email ? <div className='text-sm opacity-80'>{data.user.email}</div> : <Skeleton className='w-[150px] h-5' />}
        </div>
      </div>
      {
        data?.user ?
          <ul className='mt-2'>
            <li className={`p-2 cursor-pointer hover:bg-foreground/10 rounded-sm flex items-center ${lastPath === "profile" && "bg-foreground/10"}`} onClick={()=>router.push('/user/profile')}><FaUserPen className='mr-2 text-lg' /><span>個人資料</span></li>
            <li className={`p-2 cursor-pointer hover:bg-foreground/10 rounded-sm flex items-center ${lastPath === "myLogo" && "bg-foreground/10"}`} onClick={()=>router.push('/user/myLogo')}><FaFileImage className='mr-2 text-lg' /><span>我的圖庫</span></li>
            <li className='p-2 pt-4 border-t border-foreground/25 text-center'><Button variant='outline' className='w-full' onClick={()=>{signOut({redirect: true, callbackUrl:"/"})}}>登出</Button></li>
          </ul>
          :
          <ul className="mt-2">
            <Skeleton className="my-2 w-full h-8" />
            <Skeleton className="my-2 w-full h-8" />
          </ul>
      }
    </aside>
  )
}

export default UserSideBar