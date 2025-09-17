'use client'
import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { FaDownLong } from "react-icons/fa6";
import { useGetLogoQuery } from '@/lib/api/logoApi';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector } from '@/lib/hooks';
import TokenInvalid from "@/components/TokenInvalid";
import useTokenInvalid from '@/hooks/useTokenInvalid';
const Content = () => {
  const isTokenInvalid = useAppSelector(state => state.userReducer.isTokenInvalid)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const dataCount = 50; //每次50筆
  const { data: resData, isLoading } = useGetLogoQuery({ page: currentPage, dataCount })
  useTokenInvalid(resData ? { code: resData.code, message: resData.message } : {});
  const [allData, setAllData] = useState<{ _id: string, imageUrl: string }[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const loadCards = Array.from(Array(10));

  const downloadImg = async (imgUrl: string) => {
    try {
      let res = await fetch(imgUrl)
      let blob = await res.blob();
      let blobUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      let filePathArr = imgUrl.split("/");
      let filename = filePathArr[filePathArr.length - 1];
      a.href = blobUrl;
      a.setAttribute('download', filename);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      alert("下載失敗")
    }

  }

  useEffect(() => {
    if (loadingRef.current) {
      let observer = new IntersectionObserver((entry) => {
        if (entry[0].isIntersecting) {
          let nextPage = currentPage + 1;
          if (nextPage === resData?.data?.totalPage && loadingRef.current) {
            observer.unobserve(loadingRef.current)
          }
          setCurrentPage(nextPage)
        }
      }, { root: containerRef.current })

      observer.observe(loadingRef.current)

      return () => {
        if (loadingRef.current) {
          observer.unobserve(loadingRef.current)
        }
      }
    }
  }, [resData?.data?.totalPage])

  useEffect(() => {
    let dataCount = resData?.data?.logoData?.length || 0
    if (dataCount > 0) {
      setAllData(prev => {
        let existingIds = prev.map(item => item._id);
        let newData = resData?.data?.logoData.filter(item => !existingIds.includes(item._id));
        if (newData && newData.length > 0) {
          return [...prev, ...newData];
        }
        return prev
      })
    }
  }, [resData?.data?.currentPage])

  return (
    <div ref={containerRef} className='grow overflow-auto p-5'>
      {isTokenInvalid && <TokenInvalid />}
      <div className='flex items-start flex-wrap'>
        {isLoading && loadCards.map((item, i) => (
          <div key={i} className='w-[200px] h-[250px] rounded-b-sm mr-4 mb-5'>
            <Skeleton className='w-full h-full' />
          </div>
        ))}
        {allData.map(item => (
          <div key={item._id} className='w-[200px] h-auto border border-foreground/50 rounded-b-sm mr-4 mb-5'>
            <div>
              <Image src={item.imageUrl} alt="logo" width={1024} height={1024} className='max-w-full' />
            </div>
            <div className='py-1 text-center flex justify-center'>
              <span onClick={() => downloadImg(item.imageUrl)} className='group p-1 border border-foreground/50 rounded-sm cursor-pointer hover:bg-foreground/50'><FaDownLong className='text-foreground/50 group-hover:text-background' /></span>
            </div>
          </div>)
        )}
      </div>
      {resData?.data && resData?.data.currentPage < resData?.data.totalPage && <div className='text-center' ref={loadingRef}>載入中...</div>}
    </div>
  )
}

export default Content