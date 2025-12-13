"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { LoginForm } from "@/components/login-form";

export default function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (data.ok) {
            location.href = "/";
        } else {
            alert("Failed to login");
        }
    }


    return (
        <>
            <Header showLogout={false} />
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm
                        email={email}
                        password={password}
                        onChangeEmail={setEmail}
                        onChangePassword={setPassword}
                        onSubmit={handleLogin}
                    />
                </div>
            </div>
        </>
    );
}
