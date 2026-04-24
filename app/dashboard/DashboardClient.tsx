"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardClient({ initialTranscripts }: { initialTranscripts: any[] }) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("audio", file);

        const res = await fetch("/api/transcribe", { method: "POST", body: formData });
        if (res.ok) {
            setFile(null);
            router.refresh(); // Refresh server component to get new transcripts
        } else {
            alert("Transcription failed.");
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Transcriptions Dashboard</h1>
                <button onClick={handleLogout} className="bg-gray-200 text-black px-4 py-2 rounded">Logout</button>
            </div>

            <div className="mb-12 border p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
                <h2 className="text-xl mb-4 font-semibold">Upload Audio (&lt; 1 min)</h2>
                <div className="flex gap-4 items-center">
                    <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    <button
                        onClick={handleUpload}
                        disabled={loading || !file}
                        className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
                    >
                        {loading ? "Transcribing..." : "Transcribe File"}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold">History</h2>
                {initialTranscripts.length === 0 && <p className="text-gray-500">No transcripts found.</p>}
                {initialTranscripts.map((t) => (
                    <div key={t.id} className="border p-4 rounded bg-white dark:bg-gray-800 shadow-sm">
                        <p className="text-sm text-gray-500 mb-2">{new Date(t.createdAt).toLocaleString()}</p>
                        <p className="whitespace-pre-wrap">{t.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}