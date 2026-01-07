import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const bankCode = searchParams.get("bank_code") ?? "";
    const swiftCode = searchParams.get("swift_code") ?? "";
    const bankName = searchParams.get("bank_name") ?? "";

    const res = await fetch(
        `${process.env.BANK_API_URL}/banks?bank_code=${bankCode}&swift_code=${swiftCode}&bank_name=${bankName}`,
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
