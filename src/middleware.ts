import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Cookie からトークンを取得
    const token = request.cookies.get('session')?.value
    const { pathname } = request.nextUrl;

    // トークンを保持していて、 /login に来たら / にリダイレクト
    if (token && pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // トークンがなければ /login にリダイレクト
    if (!token && pathname !== '/login') {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

// どのルートでこのmiddlewareを有効にするか
export const config = {
    matcher: ["/((?!api|_next|favicon.ico).*)"],
}
