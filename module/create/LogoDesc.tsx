'use client'
import React from 'react'
import HeadingDescription from './HeadingDescription';
import { useFormContext } from 'react-hook-form';
const LogoDesc = () => {
  const {register, formState} = useFormContext();
  console.log('error', formState.errors)
  return (
    <>
        <HeadingDescription title="描述您的Logo" description='描述您的想法或主題，來創建出您的品牌Logo。'/>
        <input {...register('logoDesc')} type="text" placeholder='Logo描述(文字長度限制100以內)' className="w-full mt-4 border border-solid border-gray-400 rounded-sm px-2 py-2 placeholder:text-sm focus:outline-2 focus:border-primary"/>
        <p className='text-sm text-destructive'>{formState.errors.logoDesc?.message as string}</p>
    </>
  )
}

export default LogoDesc