"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function RegisterAdmin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        await authClient.signUp.email({
            email,
            password,
            name: "Admin",
        }, {
            onSuccess: () => router.push("/dashboard"),
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">

            <div className="bg-gray-900 p-8 rounded-lg w-[350px] flex flex-col gap-4">

                <h1 className="text-2xl font-bold text-white text-center">
                    Create Admin (DELETE THIS LATER)
                </h1>

                <input
                    className="border p-3 rounded bg-white text-black"
                    placeholder="Email (Username)"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="border p-3 rounded bg-white text-black"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded"
                    onClick={handleRegister}
                >
                    Create Admin Account
                </button>

            </div>
        </div>
    );
}