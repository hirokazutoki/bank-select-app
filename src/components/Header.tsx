"use client";

import {HamburgerMenu} from "@/components/HamburgerMenu";

export function Header({ showLogout = true }: { showLogout?: boolean }) {

    return (
        <header className="w-full h-14 bg-gray-100 border-b flex items-center">
            <div className="container flex items-center justify-between mx-auto px-6">
                <h1 className="text-lg font-semibold">BANK SELECT APP</h1>

                {showLogout && (
                    <HamburgerMenu />
                )}
            </div>
        </header>
    );
}
