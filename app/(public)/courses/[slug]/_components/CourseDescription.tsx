"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

interface CourseDescriptionProps {
    description: string | null;
}

export function CourseDescription({ description }: CourseDescriptionProps) {
    const content = useMemo(() => {
        if (!description) return "";

        try {
            // Try parsing as JSON
            const json = JSON.parse(description);
            // If valid JSON, generate HTML using Tiptap
            if (typeof json === 'object' && json !== null) {
                return generateHTML(json, [
                    StarterKit,
                    TextAlign.configure({ types: ["heading", "paragraph"] }),
                ]);
            }
            return description;
        } catch (e) {
            // If not JSON, return as is (assuming HTML string)
            return description;
        }
    }, [description]);

    return (
        <div
            className="prose dark:prose-invert max-w-none break-words"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
