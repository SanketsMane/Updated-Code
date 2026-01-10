
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ProbePage() {
    const results = {
        db: { status: "pending", message: "" },
        auth: { status: "pending", message: "" },
        env: {
            DATABASE_URL_SET: process.env.DATABASE_URL ? "YES" : "NO",
            BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
            BETTER_AUTH_SECRET_SET: process.env.BETTER_AUTH_SECRET ? "YES" : "NO",
        },
    };

    // Test DB
    try {
        const count = await prisma.user.count();
        results.db = { status: "success", message: `Count: ${count}` };
    } catch (e: any) {
        results.db = { status: "error", message: e.message || String(e) };
    }

    // Test Auth
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        results.auth = { status: "success", message: session ? "Session Found" : "No Session" };
    } catch (e: any) {
        results.auth = { status: "error", message: e.message || String(e) };
    }

    return (
        <div style={{ padding: 40, fontFamily: "monospace", maxWidth: 800, margin: "0 auto" }}>
            <h1>🔍 Production Probe</h1>

            <div style={{ marginBottom: 20, padding: 20, background: "#f5f5f5", borderRadius: 8 }}>
                <h2>Environment</h2>
                <pre>{JSON.stringify(results.env, null, 2)}</pre>
            </div>

            <div style={{ marginBottom: 20, padding: 20, background: results.db.status === "success" ? "#d1fae5" : "#fee2e2", borderRadius: 8 }}>
                <h2>Database Connection</h2>
                <p><strong>Status:</strong> {results.db.status.toUpperCase()}</p>
                <pre style={{ whiteSpace: "pre-wrap" }}>{results.db.message}</pre>
            </div>

            <div style={{ marginBottom: 20, padding: 20, background: results.auth.status === "success" ? "#d1fae5" : "#fee2e2", borderRadius: 8 }}>
                <h2>Auth (Better-Auth)</h2>
                <p><strong>Status:</strong> {results.auth.status.toUpperCase()}</p>
                <pre style={{ whiteSpace: "pre-wrap" }}>{results.auth.message}</pre>
            </div>
        </div>
    );
}
