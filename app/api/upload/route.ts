import { NextResponse, NextRequest } from "next/server";
import { handleUpload, HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@clerk/nextjs/server";
import { MAX_FILE_SIZE } from "@/lib/constants";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { userId } = await auth();
        console.log('[UPLOAD] Auth userId:', userId);
        
        const body = (await request.json()) as HandleUploadBody;

        const jsonResponse = await handleUpload({
            token: process.env.BLOB_READ_WRITE_TOKEN,
            body,
            request,
            onBeforeGenerateToken: async () => {
                console.log('[UPLOAD] onBeforeGenerateToken called');
                if (!userId) {
                    throw new Error('Unauthorized: User not authenticated');
                }

                return {
                    allowedContentTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
                    addRandomSuffix: true,
                    maximumSizeInBytes: MAX_FILE_SIZE,
                };
            },
        });

        console.log('[UPLOAD] Success');
        return NextResponse.json(jsonResponse);
    } catch (e) {
        const message = e instanceof Error ? e.message : "An unknown error occurred";
        const status = message.includes('Unauthorized') ? 401 : 500;
        console.error('[UPLOAD] Error:', message);
        return NextResponse.json({ error: message }, { status });
    }
}