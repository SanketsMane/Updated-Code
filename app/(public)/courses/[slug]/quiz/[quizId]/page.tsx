import { getSessionWithRole } from "@/app/data/auth/require-roles";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { QuizPlayer } from "@/components/quiz/player/QuizPlayer";
import { QuizResults } from "@/components/quiz/player/QuizResults";

export default async function QuizPage({
    params,
}: {
    params: Promise<{ slug: string; quizId: string }>;
}) {
    const { slug, quizId } = await params;
    const session = await getSessionWithRole();

    const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: {
            questions: {
                orderBy: { position: 'asc' }
            }
        }
    });

    if (!quiz) {
        notFound();
    }

    // Check Access (Enrollment)
    // We can check if user is enrolled in the generic course linked to this quiz
    // Or we assume sidebar/middleware handles access, but robust check is better.
    // Simplifying for now: assuming if they got here, they have access or we rely on generic layout protection.

    // Check for previous attempts
    const lastAttempt = await prisma.quizAttempt.findFirst({
        where: {
            quizId: quizId,
            userId: session?.user.id
        },
        orderBy: { createdAt: 'desc' }
    });

    // If passed, show results? Or create a "Retake" mode?
    // Let's show results if they have a completed attempt and it's passed, or if they just finished.
    if (lastAttempt && lastAttempt.passed) {
        return <QuizResults attempt={lastAttempt} quizId={quizId} slug={slug} />;
    }

    // If failed but attempts remain? 
    // Logic: QuizPlayer can fetch initial state or we render it fresh.

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black">
            {/* Header could go here */}
            <div className="p-4 border-b bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <span className="font-semibold text-lg">Quiz: {quiz.title}</span>
                    {/* Close / Exit Button */}
                </div>
            </div>

            <QuizPlayer quiz={quiz} />
        </div>
    );
}
