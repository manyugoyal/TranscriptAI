import { PrismaClient } from "@prisma/client";
import DashboardClient from "./DashboardClient";

const prisma = new PrismaClient();

// Prevent static generation to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    // Fetch transcripts from DB server-side
    const transcripts = await prisma.transcript.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return <DashboardClient initialTranscripts={transcripts} />;
}