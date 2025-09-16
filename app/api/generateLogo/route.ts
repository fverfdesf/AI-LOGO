import { NextResponse, NextRequest } from "next/server";
import type { LogoCreate } from "@/module/create/Content";
import { GoogleGenAI } from '@google/genai';
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { getToken } from "next-auth/jwt";
import AILogoModel from "@/Models/AILogo";
import { connectDB } from "@/lib/mongodb";
function promptTem(data: LogoCreate) {
    let jsonStr = JSON.stringify(data);
    let prompt = `You are an expert AI Prompt Engineer for a Logo Generation service. Your sole function is to convert the following structured JSON data into a single, high-quality, descriptive image generation prompt suitable for a model like Stable Diffusion XL.

        **Rules for your response:**
        - Your response MUST be ONLY the generated prompt text.
        - Do NOT include any introductory phrases (e.g., "Here is the prompt:").
        - Do NOT use any Markdown formatting (e.g., \`\`\`).
        - The entire response must be the raw string of the prompt.
        - No Chinese

        Here is the JSON data to convert:
        \`\`\`json
        ${jsonStr}
        `
    return prompt
}

async function geminiChat(model: string, prompt: string) {
    let aiChart = "";
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
    const tools = [
        {
            googleSearch: {
            }
        },
    ];
    const config = {
        thinkingConfig: {
            thinkingBudget: -1,
        },
        tools,
    };
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: prompt,
                },
            ],
        },
    ]
    try {
        const response = await ai.models.generateContentStream({
            model,
            config,
            contents,
        });
        for await (const chunk of response) {
            aiChart += chunk.text
        }
        return aiChart
    } catch (e) {
        console.log(e)
        return aiChart
    }
}

async function sdxbQuery(data: { inputs: string }): Promise<Blob | null> {
    let opt = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }
    try {
        let res = await fetch("https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0", opt);
        if (!res.ok) {
            let json = await res.json();
            throw json
        }
        let blob = await res.blob();
        return blob
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function POST(req: NextRequest) {
    let token = await getToken({ req, secret: process.env.NEXTAUTH_JWT_KEY });
    //這邊判斷是因為執行getToken時，他會在執行nextauth的jwt callback，而jwt返回的值可能會包含token.error，所以需要判斷
    if (!token || token.error) {
        return NextResponse.json({
            code: 0,
            message: "token失效",
            data: null
        })
    }
    let body: LogoCreate = await req.json();

    let aiChart = await geminiChat("gemini-2.5-pro", promptTem(body));
    let blob = await sdxbQuery({ inputs: aiChart });
    let arrayBuffer = await blob?.arrayBuffer();
    if (!arrayBuffer) {
        return NextResponse.json({
            code: 0,
            message: "生成失敗",
            data: null
        })
    }

    let imageBuffer = Buffer.from(arrayBuffer);
    // 定義儲存路徑
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    //定義圖片檔名並連結成一個完整的圖片路徑
    const fileName = `aig_logo_${Date.now()}.png`;
    const filePath = path.join(uploadDir, fileName);

    // 將 Buffer 寫入檔案系統
    await writeFile(filePath, imageBuffer);
    const publicUrl = `/uploads/${fileName}`;
    try {
        await connectDB();
        let aiLogoDoc = new AILogoModel({ userId: token?.user?.id, imageUrl: publicUrl });
        await aiLogoDoc.save();
    } catch (e) {
        return NextResponse.json({
            code: 0,
            message: e,
            data: null
        })
    }

    return NextResponse.json({
        code: 1,
        message: "生成成功",
        data: {
            url: publicUrl
        }
    })
}

