import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { bankCode: string } }
) {
    const { bankCode } = params;
    const { searchParams } = new URL(req.url);

    const branchCode = searchParams.get("branch_code") ?? "";
    const branchName = searchParams.get("branch_name") ?? "";

    const queryParams = new URLSearchParams({
        branch_code: branchCode,
        branch_name: branchName,
    });

    const res = await fetch(
        `${process.env.BANK_API_URL}/banks/${bankCode}/branches?${queryParams}`,
        {
            headers: {
                "X-API-KEY": process.env.BANK_API_KEY!,
            },
        }
    );

    const body = await res.json().catch(() => null);

    if (!res.ok) {
        return NextResponse.json(
            {
                message: "External API error",
                status: res.status,
                body,
            },
            { status: res.status }
        );
    }

    return NextResponse.json(body);
}
