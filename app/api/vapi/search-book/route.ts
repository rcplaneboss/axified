import { NextResponse } from 'next/server';
import { searchBookSegments } from '@/lib/actions/book.actions';

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://dashboard.vapi.ai',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

async function processBookSearch(bookId: unknown, query: unknown) {
    if (bookId == null || query == null || query === '') {
        return { result: 'Missing bookId or query' };
    }
    const bookIdStr = String(bookId);
    const queryStr = String(query).trim();

    if (!bookIdStr || bookIdStr === 'null' || bookIdStr === 'undefined' || !queryStr) {
        return { result: 'Missing bookId or query' };
    }

    const searchResult = await searchBookSegments(bookIdStr, queryStr, 3);
    if (!searchResult.success || !searchResult.data?.length) {
        return { result: 'No information found about this topic in the book.' };
    }

    const combinedText = searchResult.data
        .map((segment) => (segment as { content: string }).content)
        .join('\n\n');

    return { result: combinedText };
}

export async function GET() {
    return NextResponse.json({ status: 'ok' }, { headers: corsHeaders });
}

function parseArgs(args: unknown): Record<string, unknown> {
    if (!args) return {};
    if (typeof args === 'string') {
        try { return JSON.parse(args); } catch { return {}; }
    }
    return args as Record<string, unknown>;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const functionCall = body?.message?.functionCall;
        const toolCallList = body?.message?.toolCallList || body?.message?.toolCalls;

        if (functionCall) {
            const { name, parameters } = functionCall;
            const parsed = parseArgs(parameters);

            if (name === 'searchBook') {
                const result = await processBookSearch(parsed.bookId, parsed.query);
                return NextResponse.json(result, { headers: corsHeaders });
            }
            return NextResponse.json({ result: `Unknown function: ${name}` }, { headers: corsHeaders });
        }

        if (!toolCallList || toolCallList.length === 0) {
            return NextResponse.json(
                { results: [{ result: 'No tool calls found' }] }, 
                { headers: corsHeaders }
            );
        }

        const results = [];
        for (const toolCall of toolCallList) {
            const { id, function: func } = toolCall;
            const args = parseArgs(func?.arguments);

            if (func?.name === 'searchBook') {
                const searchResult = await processBookSearch(args.bookId, args.query);
                results.push({ toolCallId: id, ...searchResult });
            } else {
                results.push({ toolCallId: id, result: `Unknown function: ${func?.name}` });
            }
        }

        return NextResponse.json({ results }, { headers: corsHeaders });
    } catch (error) {
        console.error('Vapi search-book error:', error);
        return NextResponse.json(
            { results: [{ result: 'Error processing request' }] },
            { status: 500, headers: corsHeaders }
        );
    }
}