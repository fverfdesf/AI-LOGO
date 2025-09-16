import React, { useRef, useState, useEffect } from 'react'
import { FaXmark, FaImage, FaCircleNotch, FaCircleXmark, FaRegCircleCheck } from "react-icons/fa6";
import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider"
import Cropper, { Area } from 'react-easy-crop'
import { useAvatarUploadMutation } from '@/lib/api/userApi';
import { useSession } from 'next-auth/react';
import MsgAlert from '@/components/MsgAlert';
import useTokenInvalid from '@/hooks/useTokenInvalid';
const AvatarModal = ({ originImage, setOriginImage, fileRef }: { originImage: string, setOriginImage: React.Dispatch<React.SetStateAction<string | null>>, fileRef: React.RefObject<HTMLInputElement | null> }) => {
    let { update } = useSession();
    let [avatarUpload, { isLoading, isError, data: resData }] = useAvatarUploadMutation();
    useTokenInvalid(resData ? {code: resData.code, message: resData.message} : {});
    let [zoom, setZoom] = useState<number>(1);
    let [crop, setCrop] = useState({ x: 0, y: 0 });
    let [cropArea, setCropArea] = useState<Area | null>(null)
    let isUploadFile = useRef<boolean>(false)
    let [isShowMsg, setIsShowMsg] = useState<boolean>(false)
    function CropComplete(croppedArea: Area, croppedAreaPixels: Area) {
        setCropArea(croppedAreaPixels)
    }
    function createImg(image: string): Promise<HTMLImageElement | Error> {
        return new Promise((resolve, reject) => {
            let imageEl = document.createElement('img');
            imageEl.onload = () => {
                resolve(imageEl)
            }
            imageEl.onerror = () => {
                reject(new Error("圖片加載失敗"))
            }
            imageEl.src = image;
            imageEl.crossOrigin = "anonymous";
        })
    }
    async function uploadCropImgHandler(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        //不能依靠isLoading去做判斷，因為下面處理非同步程式會await，並不會馬上去更改isLoading狀態，如果使用者滑鼠點擊再快一點的話會觸發多次請求，
        //所以需要要自訂義一個變數，做一個閥門。
        if (isUploadFile.current) return "";
        if (originImage && cropArea) {
            isUploadFile.current = true
            try {
                let imageEl = await createImg(originImage);
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                canvas.width = cropArea.width;
                canvas.height = cropArea.height;
                ctx?.beginPath();
                ctx?.arc(
                    cropArea.width / 2,   // 圓心 X
                    cropArea.height / 2,  // 圓心 Y
                    cropArea.width / 2,   // 半徑
                    0,
                    2 * Math.PI
                );
                ctx?.closePath();
                ctx?.clip(); // 將繪製範圍限制在圓形內
                ctx?.drawImage(
                    imageEl as HTMLImageElement,
                    cropArea.x,
                    cropArea.y,
                    cropArea.width,
                    cropArea.height,
                    0, 0, cropArea.width, cropArea.height
                )
                canvas.toBlob(async (blob) => {
                    console.log("1")
                    if (blob) {
                        //圖片上傳
                        let formData = new FormData();
                        formData.append('avatar', blob)
                        let res = await avatarUpload(formData).unwrap();
                        if (res.code && res?.data?.imageURL) { //上傳成功
                            setIsShowMsg(true);
                            update({ image: res.data.imageURL })
                        }
                        isUploadFile.current = false
                    }
                })
            } catch (err) {
                isUploadFile.current = false
                alert((err as Error).message)
            }
        }
    }

    function closeAvatarModal(e?: React.MouseEvent) {
        e?.preventDefault();
        if (fileRef?.current?.value) {
            fileRef.current.value = ''
        }
        setOriginImage(null)
    }

    return (
        <>
            {isShowMsg && <MsgAlert setIsShowMsg={setIsShowMsg} icon={<FaCircleXmark className="!text-red-700" />} title={resData?.code ? <span className='text-green-700'>上傳成功</span> : <span className="text-red-700">上傳失敗</span>}>{!data?.code && data?.message !== "" && <span className='text-red-700'>{data?.message}</span>}</MsgAlert>}
            <div className='absolute top-0 left-0 right-0 bottom-0 bg-black/25' onClick={closeAvatarModal}></div>
            <div className='absolute left-1/2 top-1/2 -translate-1/2 bg-background border-2 border-white  py-2 rounded-lg w-[500px] '>
                <div className='relative text-center mb-2'>
                    <div className=''>選擇圖片</div>
                    <FaXmark className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' onClick={closeAvatarModal} />
                </div>
                <div className='relative w-full h-[300px]'>
                    <Cropper
                        image={originImage}
                        crop={crop}
                        zoom={zoom}
                        minZoom={1}
                        maxZoom={2}
                        zoomWithScroll={true}
                        zoomSpeed={0.1}
                        aspect={3 / 3}
                        cropShape="round"
                        onCropChange={setCrop}
                        onCropComplete={CropComplete}
                        onZoomChange={setZoom}
                        showGrid={false}
                        style={{ cropAreaStyle: { 'borderWidth': '3px', 'borderColor': 'white' } }}
                    />
                </div>
                <div>
                    <div className='flex items-center justify-center mt-4 max-w-[50%] mx-auto'>
                        <FaImage className='scale-[1] text-gray-500' />
                        <Slider className="mx-2" min={1} max={2} step={0.1} value={[zoom]} onValueChange={(values) => setZoom(values[0])} />
                        <FaImage className='scale-[1.5] text-gray-500' />
                    </div>
                    <div className='flex justify-end mt-4'>
                        <Button variant="outline" onClick={closeAvatarModal}>取消</Button>
                        <Button onClick={uploadCropImgHandler} className={`mr-6 ml-4 ${isLoading ? 'bg-primary/50 hover:bg-primary/50' : ""}`}>{isLoading ? [<FaCircleNotch className="animate-spin" />, "上傳中"] : "送出"}</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AvatarModal