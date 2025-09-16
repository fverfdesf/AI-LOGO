'use client'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { useRouter } from "next/navigation";
const Protected = ({ children }: { children: React.ReactNode }) => {
    let { data: session, status } = useSession()
    let router = useRouter()
    useEffect(() => {
        if (status === "unauthenticated" || (status === "authenticated" && session?.error)) {
             router.push('/')
        }
    }, [status, session?.error])

    if (status === "authenticated" && !session?.error) {
        return (
            <>
                {children}
            </>
        )
    } else {
        return null
    }
}

export default Protected