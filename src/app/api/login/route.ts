import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    // 環境変数で管理してもOK
    const VALID_USER = process.env.LOGIN_EMAIL ?? "demo@example.com";
    const VALID_PASS = process.env.LOGIN_PASS ?? "Test1234@";

    if (email === VALID_USER && password === VALID_PASS) {
        // Cookieにセッショントークンっぽいものを入れる
        const res = NextResponse.json({ ok: true });
        const session = process.env.SESSION ?? "bank-select-app-session";
        res.cookies.set("session", session, { httpOnly: true });
        return res;
    }

    return NextResponse.json({ ok: false }, { status: 401 });
}
