"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await authClient.signIn.email({ email, password }, {
      onSuccess: () => router.push("/dashboard"),
      onError: (ctx) => setError(ctx.error.message),
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm border border-gray-600 p-8 rounded-lg shadow-md bg-black">
        <h1 className="text-2xl font-bold text-center mb-4 text-white">Admin Login</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          className="border border-gray-300 p-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Username (Email)"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border border-gray-300 p-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition-colors mt-2"
        >
          Log In
        </button>
      </form>
    </main>
  );
}