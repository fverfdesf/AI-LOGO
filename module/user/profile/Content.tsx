'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { FaPen } from "react-icons/fa6";
import { Button } from '@/components/ui/button';
import AvatarModal from './AvatarModal';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from 'react-hook-form';
import { useProfileEditMutation } from '@/lib/api/userApi';
import { useAppSelector } from '@/lib/hooks';
import TokenInvalid from "@/components/TokenInvalid";
import useTokenInvalid from '@/hooks/useTokenInvalid';
const profileSchema = z.object({
  nickName: z.string()
})

type Profile = z.infer<typeof profileSchema>;
const Content = () => {
  console.log('Profile')
  const isTokenInvalid = useAppSelector(state => state.userReducer.isTokenInvalid)
  const { data: session, update } = useSession()
  useTokenInvalid({});
  const { register, handleSubmit, reset } = useForm<Profile>({
    resolver: zodResolver(profileSchema)
  });
  const [profileEdit] = useProfileEditMutation()
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [originImage, setOriginImage] = useState<string | null>(null);
  let avatarPath = "/images/logoipsum-396.png";
  if (session?.user?.image) avatarPath = session.user.image as string

  function fileChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (fileRef.current?.files && fileRef.current?.files[0]) {
      let file = fileRef.current?.files[0];
      return setOriginImage(URL.createObjectURL(file))
    }
    setOriginImage(null)
  }

  useEffect(() => {
    if (session?.user?.name) {
      reset({
        nickName: session.user.name
      })
    }
  }, [session])

  const profileSubmit: SubmitHandler<Profile> = async (data) => {
    let res = await profileEdit(data).unwrap()
    if (res.code) {
      update({name: res?.data?.newNickName})
    }
  }

  return (
    <div className='grow relative'>
      {isTokenInvalid && <TokenInvalid />}
      {
        session?.user ?
          <div onClick={() => fileRef.current?.click()} className='mt-5 mx-auto w-40 h-40 overflow-hidden rounded-full flex items-center justify-center border border-foreground/50 relative cursor-pointer group select-none'>
            <Image src={avatarPath} alt="avatar" width={400} height={400} className='max-w-full align-middle' />
            <div className='absolute text-2xl top-0 left-0 bottom-0 right-0 bg-black/20 flex items-center justify-center opacity-0 duration-100 group-has-hover:opacity-100'><FaPen className='text-white' /></div>
            <input type="file" accept='image/*' className='hidden' ref={fileRef} onChange={fileChangeHandler} />
          </div>
          :
          <Skeleton className="mt-5 mx-auto w-40 h-40 rounded-full" />
      }
      {
        session?.user ?
          <form className='max-w-[300px] mx-auto' onSubmit={handleSubmit(profileSubmit)}>
            {originImage && <AvatarModal originImage={originImage} setOriginImage={setOriginImage} fileRef={fileRef} />}
            <label className='block my-4'>
              <span className='block'>暱稱</span>
              <input type="text" {...register('nickName')} className='w-full border border-solid border-gray-400 rounded-sm px-2 p-1 focus:outline-2 focus:border-primary ' />
            </label>
            <label className='block'>
              <span className='block'>信箱</span>
              <input type="text" value={session?.user?.email || ""} className='w-full border border-solid border-gray-400 rounded-sm px-2 p-1 disabled:bg-black/5' disabled />
            </label>
            <Button className='block ml-auto mt-4 cursor-pointer'>儲存</Button>
          </form>
          :
          <div className='w-full max-w-[300px] mx-auto'>
            <Skeleton className="w-full h-10 my-4" />
            <Skeleton className="w-full h-10" />
          </div>
      }

    </div>
  )
}

export default Content