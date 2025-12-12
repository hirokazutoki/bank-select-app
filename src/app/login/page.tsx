"use client";

import {useState} from "react";
import {Header} from "@/components/Header";
import * as React from "react";

export default function Home() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        if (res.ok) {
            location.href = "/";
        } else {
            alert("Failed to login");
        }
    }

    return (
        <>
            <Header />
            <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
                <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                    <input value={username} onChange={e => setUsername(e.target.value)} placeholder="メールアドレス" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="パスワード" />
                    <button className="btn btn-blue" onClick={handleLogin}>ログイン</button>
                </main>
            </div>
        </>
    );
}
