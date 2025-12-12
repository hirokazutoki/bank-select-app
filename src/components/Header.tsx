"use client";

import { useRouter } from "next/navigation";

export function Header() {
    const router = useRouter();

    const handleLogout = () => {
        // ここにログアウト処理を書く
        console.log("logout!");
        router.push("/login");
    };

    return (
        <header className="w-full h-14 bg-gray-100 border-b flex items-center">
            <div className="container flex items-center justify-between mx-auto px-6">
                <h1 className="text-lg font-semibold">BANK SELECT APP</h1>

                <button
                    onClick={handleLogout}
                    className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                    ログアウト
                </button>
            </div>
        </header>
    );
}
