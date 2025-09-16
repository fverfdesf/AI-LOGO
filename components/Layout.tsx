import React from 'react'

type Props = {
    children: React.ReactNode
    className?:string
}

const Layout = ({children, className}:Props) => {
  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>{children}</div>
  )
}

export default Layout