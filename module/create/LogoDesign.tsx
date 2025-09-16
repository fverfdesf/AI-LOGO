'use client'
import React from 'react'
import HeadingDescription from './HeadingDescription'
import { useFormContext } from 'react-hook-form'
import Image from 'next/image'
export const designStyle = [
  {
    value: "Cartoon",
    image: "/images/cartoon.png",
    name: "卡通"
  },
  {
    value: "App",
    image: "/images/app.png",
    name: "App"
  },
  {
    value: "Mascot",
    image: "/images/modern_mascot.png",
    name: "吉祥物"
  },
  {
    value: "Minimalist And Elegant",
    image: "/images/minimalist_elegant.png",
    name: "簡約優雅"
  },
  {
    value: "Vintage",
    image: "/images/vintage.png",
    name: "復古"
  }
]

const LogoDesign = () => {
  const { register } = useFormContext();
  return (
    <>
      <HeadingDescription title="選擇您的風格" description='選擇能夠代表您品牌的Logo類型。' />
      <div className="flex flex-wrap mt-6">
        {designStyle.map((item, i) => {
          return <div key={i} className='w-[250px] mr-10 mt-5'>
            <input id={`design-${i}`} type="radio" className='peer hidden' {...register('logoDesign')} defaultValue={item.value}/>
            <label htmlFor={`design-${i}`} className='cursor-pointer border border-solid border-muted-foreground/50 rounded-sm  overflow-hidden block peer-checked:border-primary'>
              <Image src={item.image} alt="cartoon" width={1024} height={1024} className="max-w-full" />
              <p className='text-center font-bold text-foreground border-t border-solid border-muted-foreground/50 py-2'>{item.name}</p>
            </label>
          </div>
        })}
      </div>
    </>
  )
}

export default LogoDesign