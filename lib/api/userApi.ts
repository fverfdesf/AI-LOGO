import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ResponseData } from "./type";
export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_DOMAIN || '' }),
    endpoints: (build) => {
        return {
            avatarUpload: build.mutation<ResponseData<{ imageURL: string }>, FormData>(
                {
                    query: (formData) => ({
                        url: "/api/avatarUpload",
                        method: "POST",
                        body: formData
                    })
                }
            ),
            profileEdit: build.mutation<ResponseData<{newNickName: string}>, {nickName: string}>(
                {
                    query: (reqData) => ({
                        url: "/api/profileEdit",
                        method: "POST",
                        body: reqData
                    })
                }
            ),
            sendCode: build.mutation<ResponseData<null>, {email: string}>(
                {
                    query: (reqData) => ({
                        url: "/api/sendCode",
                        method: "POST",
                        body: reqData
                    })
                }
            ),
            register: build.mutation<ResponseData<null>, {email: string, password: string, code: string}>(
                {
                    query: (reqData) => ({
                        url: "/api/register",
                        method: "POST",
                        body: reqData
                    })
                }
            ),

        }
    }
})

export const {useAvatarUploadMutation, useProfileEditMutation, useSendCodeMutation, useRegisterMutation} = userApi