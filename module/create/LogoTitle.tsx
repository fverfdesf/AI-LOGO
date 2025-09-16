'use client'
import React from 'react'
import HeadingDescription from './HeadingDescription'
import { useFormContext } from 'react-hook-form'
const LogoTitle = () => {
  const {register, formState} = useFormContext();
  console.log('error', formState.errors)
  
  return (
    <>
        <HeadingDescription title="Logo標題" description='為您的Logo取名，可以是企業名稱、網站名稱、APP名稱，自訂專屬於您的Logo。'/>
        <input {...register('logoTitle')} type="text" placeholder='Logo標題' className="w-full mt-4 border border-solid border-gray-400 rounded-sm px-2 py-2 placeholder:text-sm focus:outline-2 focus:border-primary"/>
        <p className='text-sm text-destructive'>{formState.errors.logoTitle?.message as string}</p>
    </>
  )
}

export default LogoTitle