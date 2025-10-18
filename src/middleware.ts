import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Cookie からトークンを取得
    const token = request.cookies.get('session')?.value

    // トークンがなければ /login にリダイレクト
    if (!token && request.nextUrl.pathname !== '/login') {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

// どのルートでこのmiddlewareを有効にするか
export const config = {
    matcher: ['/'],
}
