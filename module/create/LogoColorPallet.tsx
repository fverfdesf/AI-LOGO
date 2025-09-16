'use client'
import React from 'react'
import HeadingDescription from './HeadingDescription'
import { useFormContext } from 'react-hook-form'

export const colorPallette = [
  {
    value: "Olive Garden Feast",
    palletteName: "橄欖園盛宴",
    colors: ["#606C38", "#283618", "#FEFAE0", "#DDA15E", "#BC6C25"]
  },
  {
    value: "Pastel Dreamland Adventure",
    palletteName: "夢幻冒險",
    colors: ["#CDB4DB", "#ffc8dd", "#ffafcc", "#bde0fe", "#a2d2ff"]
  },
  {
    value: "Fiery Ocean",
    palletteName: "熾熱海洋",
    colors: ["#780000", "#c1121f", "#fdf0d5", "#003049", "#669bbc"]
  },
  {
    value: "Soft Pink Delight",
    palletteName: "粉色喜悅",
    colors: ["#ffe5ec", "#ffc2d1", "#ffb3c6", "#ff8fab", "#fb6f92"]
  },
  {
    value:"Refreshing Summer Fun",
    palletteName: "清爽夏日",
    colors: ["#8ecae6", "#219ebc", "#023047", "#ffb703", "#fb8500"]
  },
  {
    value: "Summer Ocean Breeze",
    palletteName: "夏日海風",
    colors: ["#e63946", "#f1faee", "#a8dadc", "#457b9d", "#1d3557"]
  }
]

const LogoColorPallet = () => {
  const {register} = useFormContext();
  return (
    <>
        <HeadingDescription title="選擇您的顏色" description='選擇一種適合您Logo顏色，加深您的品牌個性。'/>
        <div className='grid grid-cols-3 gap-10 gap-y-4 mt-6'>
          {colorPallette.map((item, i) => {
            return (
            <div key={i} className='mt-2'>
              <p>{item.palletteName}</p>
              <input id={`color-pallet-${i}`} type="radio" className='peer hidden' {...register('logoColorPallette')} defaultValue={`${item.value}|${item.colors}`}/>
              <label htmlFor={`color-pallet-${i}`} className='mt-4 duration-75 flex cursor-pointer w-full rounded-xs peer-checked:outline-3 peer-checked:outline-offset-8 peer-checked:outline-primary'>
                {item.colors.map((color,i) => {
                  return <div key={i} style={{background:color}}className="h-16 grow"></div>
                })}
              </label>
          </div>
          )
          })}
        </div>
    </>
  )
}

export default LogoColorPallet