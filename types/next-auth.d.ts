import 'next-auth';
import 'next-auth/jwt';
declare module 'next-auth' {
    interface Session {
        error?: string
    }
    interface User{
        id: string,
        name: string,
        email: string,
        image: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string,
        refreshToken?: string,
        user?: User
        error?: string
    }
}