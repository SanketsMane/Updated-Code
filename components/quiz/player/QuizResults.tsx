"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface QuizResultsProps {
    attempt: any;
    quizId: string;
    slug: string; // for navigation back to course
}

export function QuizResults({ attempt, quizId, slug }: QuizResultsProps) {
    const router = useRouter();
    const isPassed = attempt.passed;

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <Card className={`border-t-8 ${isPassed ? 'border-t-emerald-500' : 'border-t-red-500'} shadow-lg`}>
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4">
                        {isPassed ? (
                            <CheckCircle className="h-20 w-20 text-emerald-500" />
                        ) : (
                            <XCircle className="h-20 w-20 text-red-500" />
                        )}
                    </div>
                    <CardTitle className="text-3xl font-bold">
                        {isPassed ? "Congratulations!" : "Keep Practicing"}
                    </CardTitle>
                    <CardDescription className="text-lg">
                        You {isPassed ? "passed" : "did not pass"} the quiz.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 text-center">
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mt-4">
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
                            <div className="text-sm text-muted-foreground uppercase tracking-wide font-semibold">Score</div>
                            <div className={`text-3xl font-bold ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                                {Math.round(attempt.percentage)}%
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
                            <div className="text-sm text-muted-foreground uppercase tracking-wide font-semibold">Points</div>
                            <div className="text-3xl font-bold text-slate-700 dark:text-slate-200">
                                {attempt.totalPoints}/{attempt.maxPoints}
                            </div>
                        </div>
                    </div>

                    <p className="text-muted-foreground">
                        {isPassed
                            ? "Great job! You have successfully demonstrated your understanding of this topic."
                            : "Don't worry, you can review the material and try again to improve your score."}
                    </p>
                </CardContent>

                <CardFooter className="flex justify-center gap-4 pb-8">
                    <Button variant="outline" asChild>
                        <Link href={`/courses/${slug}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Course
                        </Link>
                    </Button>
                    {!isPassed && (
                        <Button onClick={() => router.refresh()}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Retake Quiz
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
