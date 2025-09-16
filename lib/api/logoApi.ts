
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LogoCreate } from "@/module/create/Content";
import type { ResponseData } from "./type";
export const logoApi = createApi({
    reducerPath: "logoApi",
    baseQuery: fetchBaseQuery({baseUrl: process.env.NEXT_PUBLIC_API_DOMAIN || ''}),
    endpoints: (build) => ({
        getLogo: build.query<ResponseData<{totalPage: number, currentPage: number, logoTotal: number, logoData:{_id:string ,imageUrl: string}[]}>,{page: number, dataCount: number}>({
            query: (data) => {
                let searchParams = "";
                for(let [key, val] of Object.entries(data)){
                    searchParams += `&${key}=${val}`
                }
                searchParams = searchParams.substring(1)
                return {url: `/api/getLogo?${searchParams}`}
            }
        }),
        generateLogo: build.mutation<ResponseData<{image: string}>,LogoCreate>({
            query: (data) => ({
                url: "/api/generateLogo",
                method: "POST",
                body: data
            })
        })
    })
})

export const {useGetLogoQuery, useGenerateLogoMutation} = logoApi
