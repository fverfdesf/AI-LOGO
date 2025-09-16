'use client'
import React,{useEffect} from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
const MsgAlert = ({
  children,
  title,
  icon,
  setIsShowMsg
}: Readonly<{
  children?: React.ReactNode,
  title?: React.ReactNode,
  icon?: React.ReactNode,
  setIsShowMsg: React.Dispatch<React.SetStateAction<boolean>>
}>) => {
  
  useEffect(()=>{
    let timer = setTimeout(()=>{
      setIsShowMsg(false)
    }, 3000)
    return ()=>{
      clearTimeout(timer);
    }
  },[])

  return (
    <Alert className='fixed top-[10px] z-[999] w-auto max-w-[300px] animate-msg-alert left-1/2 -translate-x-1/2'>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {children}
      </AlertDescription>
    </Alert>
  )
}

export default MsgAlert