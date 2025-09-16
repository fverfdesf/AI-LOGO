import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { signOut } from 'next-auth/react';
import { setIsTokenInvalid } from '@/lib/slice/userSlice';
import { useAppDispatch } from '@/lib/hooks';
const TokenInvalid = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setIsTokenInvalid(false))
            signOut({ redirect: true, callbackUrl: "/" })
        }, 3000);

        return () => {
            clearTimeout(timer)
        }
    }, [])

    return (
        <>
            <div className='absolute left-0 right-0 top-0 bottom-0 bg-black/50'>
                <div className='absolute top-1/2 left-1/2 -translate-1/2 bg-background border border-foreground/45 rounded-sm p-4'>
                    <p>登入已過期，請重新登入</p>
                    <Button className='mt-4 cursor-pointer' onClick={() => {
                        dispatch(setIsTokenInvalid(false))
                        signOut({ redirect: true, callbackUrl: "/" })
                    }}>確定</Button>
                </div>
            </div>

        </>
    )
}

export default TokenInvalid