import React from 'react'
import Layout from '@/components/Layout';
import Content from '@/module/user/Content';
import Protected from '../Protected';
const UserLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <Protected>
            <Layout className='grow flex flex-col'>
                <Content>
                    {children}
                </Content>
            </Layout>
        </Protected>
    )
}

export default UserLayout