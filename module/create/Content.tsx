"use client";
import React, { useState } from "react";
import LogoTitle from "./LogoTitle";
import LogoDesc from "./LogoDesc";
import LogoDesign from "./LogoDesign";
import LogoColorPallet from "./LogoColorPallet";
import LogoIdea from "./LogoIdea";
import { Button } from "@/components/ui/button";
import { FaAngleRight, FaAngleLeft, FaGear, FaCheck } from "react-icons/fa6";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { colorPallette } from "./LogoColorPallet";
import { designStyle } from "./LogoDesign";
import { useGenerateLogoMutation } from "@/lib/api/logoApi";
import MsgAlert from "@/components/MsgAlert";
import { FaCircleCheck } from "react-icons/fa6";
import { useAppSelector } from '@/lib/hooks';
import useTokenInvalid from "@/hooks/useTokenInvalid";
import TokenInvalid from "@/components/TokenInvalid";
const step1Schema = z.object({
  logoTitle: z.string().min(1, "欄位不能為空")
});
const step2Schema = z.object({
  logoDesc: z.string().min(1, "欄位不能為空").max(100, "文字長度不能超過100")
});
const step3Schema = z.object({
  logoColorPallette: z.enum(colorPallette.map((item) => {
    let colors: string = item.colors.join(",");
    return `${item.value}|${colors}`;
  }), '請選擇顏色風格')
});
const step4Schema = z.object({
  logoDesign: z.enum(designStyle.map((item) => item.value), '請選擇顏色風格')
});
//組合所有步驟的schema
const logoCreateSchema = step1Schema.extend(step2Schema.shape).extend(step3Schema.shape).extend(step4Schema.shape);
export type LogoCreate = z.infer<typeof logoCreateSchema>;

const Content = () => {
  const isTokenInvalid = useAppSelector(state => state.userReducer.isTokenInvalid)
  const [generateLogo, { data: resData, isLoading, isError }] = useGenerateLogoMutation()
  
  useTokenInvalid(resData ? {code: resData.code, message: resData.message} : {});
  const [isShowMsg, setIsShowMsg] = useState<boolean>(false)
  const formMethod = useForm<LogoCreate>({
    resolver: zodResolver(logoCreateSchema),
  });
  const [step, setStep] = useState<number>(1);
  const prevPage = (e: any) => {
    e.preventDefault();
    setStep(step - 1);
  };
  const nextPage = async (e: any) => {
    e.preventDefault();
    let stepSchema = null;
    switch (step) {
      case 1:
        stepSchema = step1Schema;
        break;
      case 2:
        stepSchema = step2Schema;
        break;
      case 3:
        stepSchema = step3Schema;
        break;
      case 4:
        stepSchema = step4Schema;
        break;
    }
    if(!stepSchema) return
    let isSuccess = await formMethod.trigger(Object.keys(stepSchema.shape) as ("logoTitle" | "logoDesc" | "logoColorPallette" | "logoDesign")[]);
    if (isSuccess) {
      setStep(step + 1);
    }
  };
  const logoCreateSubmit: SubmitHandler<LogoCreate> = async (data) => {
    if (isLoading) return
    //發出生成logo請求
    await generateLogo(data).unwrap();
    setIsShowMsg(true);
  };
  // let schedultClass = 'bg-green-600 border-green-600 text-white'
  return (
    <>
      {isTokenInvalid && <TokenInvalid />}
      {isShowMsg && resData?.code === 1 && <MsgAlert title={<span className="text-green-600">生成成功</span>} setIsShowMsg={setIsShowMsg} icon={<FaCircleCheck className="!text-green-700" />} />}
      {isShowMsg && resData?.code === 0 && <MsgAlert title={<span className="text-red-600">生成失敗</span>} setIsShowMsg={setIsShowMsg} icon={<FaCircleCheck className="!text-red-700" />} />}

      <FormProvider {...formMethod}>
        <form
          onSubmit={formMethod.handleSubmit(logoCreateSubmit)}
          className="mx-4 mt-20 p-6 py-10 border border-solid border-muted-foreground/50 rounded-sm inset-shadow-xs"
        >
          {step === 1 && <LogoTitle />}
          {step === 2 && <LogoDesc />}
          {step === 3 && <LogoColorPallet />}
          {step === 4 && <LogoDesign />}
          {step === 5 && <LogoIdea />}
          <div className="flex justify-between mt-10">
            {step !== 1 &&
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={prevPage}
              >
                <FaAngleLeft />返回
              </Button>}
            {step !== 4 &&
              <Button className="cursor-pointer" onClick={nextPage}>
                下一頁<FaAngleRight />
              </Button>}
            {step === 4 &&
              <Button className={`cursor-pointer ${isLoading && 'opacity-50 cursor-no-drop'}`}>
                {isLoading ? "生成中" : "送出"}
              </Button>}
          </div>
        </form>
        <DevTool control={formMethod.control} />
      </FormProvider>
    </>
  );
};

export default Content;
