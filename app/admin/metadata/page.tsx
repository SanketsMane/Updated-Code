import { createExpertise, createLanguage, deleteExpertise, deleteLanguage, getMetadata } from "@/app/actions/metadata";
import { MetadataManager } from "./_components/metadata-manager";

export const dynamic = "force-dynamic";

export default async function MetadataPage() {
    const { expertise, languages } = await getMetadata();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Metadata Management</h1>
                <p className="text-muted-foreground">Manage expertise areas and languages for teacher registration.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Expertise */}
                <MetadataManager
                    title="Expertise Areas"
                    items={expertise}
                    onAdd={createExpertise}
                    onDelete={deleteExpertise}
                />

                {/* Languages */}
                <MetadataManager
                    title="Languages"
                    items={languages}
                    onAdd={createLanguage}
                    onDelete={deleteLanguage}
                />
            </div>
        </div>
    );
}
