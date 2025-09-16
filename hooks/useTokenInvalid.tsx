import React, {useEffect} from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { setIsTokenInvalid } from '@/lib/slice/userSlice'
import { useSession } from 'next-auth/react'
type Data = {
    code?: number,
    message?: string
}
const useTokenInvalid = ({code, message}:Data) => {
  console.log('useTokenInvalid')
  const dispatch = useAppDispatch();
  const {data: session, status} = useSession()
  console.log('useTokenInvalid', session, message)
    useEffect(()=>{
      console.log('useTokenInvalid effect')
        if(code === 0 && message === "token失效" || (status === "authenticated" && session?.error)){
            dispatch(setIsTokenInvalid(true))
        }
    }, [message, session?.error])
  return null
}

export default useTokenInvalid