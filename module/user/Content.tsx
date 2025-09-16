import React from 'react'
import UserSideBar from './UserSideBar'

const Content = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    console.log('User Content');
    
    return (
        <div className='flex grow'>
            <UserSideBar />
            {children}
        </div>
    )
}

export default Content