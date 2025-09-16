'use client'
import React from 'react'

type Props = {
    title: string,
    description: string
}

const HeadingDescription = ({title, description}: Props) => {
  return (
    <div>
        <h1 className='text-3xl text-primary font-bold'>{title}</h1>
        <p className='text-muted-foreground pt-1'>{description}</p>
    </div>
  )
}

export default HeadingDescription