import { prisma } from "@/lib/db";
import { cache } from "react";

export const getSiteSettings = cache(async () => {
    const settings = await prisma.siteSettings.findFirst();
    return settings;
});
