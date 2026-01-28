"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizQuestionRenderer } from "./QuizQuestionRenderer";
import { AlertCircle, CheckCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Assuming sonner is used for toasts
import { submitQuizAttempt } from "@/app/actions/quiz"; // Placeholder for action

interface QuizPlayerProps {
    quiz: any; // Using looser typing for speed, ideally match Prisma type
    attemptId?: string;
}

export function QuizPlayer({ quiz, attemptId }: QuizPlayerProps) {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(
        quiz.timeLimit ? quiz.timeLimit * 60 : null
    );

    const questions = quiz.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    // Timer Logic
    useEffect(() => {
        if (timeLeft === null) return;
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format Time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (answer: any) => {
        setResponses((prev) => ({
            ...prev,
            [currentQuestion.id]: answer
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Ideally call server action here
            // await submitQuizAttempt(quiz.id, responses);

            // Simulating API call for now or we will implement the action next
            const payload = {
                quizId: quiz.id,
                attemptId: attemptId,
                responses: responses
            };

            // console.log("Submitting quiz:", payload);
            await submitQuizAttempt(payload);

            toast.success("Quiz submitted successfully!");
            router.refresh(); // Refresh to show results
        } catch (error) {
            console.error("Failed to submit quiz", error);
            toast.error("Failed to submit quiz. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentQuestion) {
        return <div>No questions in this quiz.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            {/* Header: Progress & Timer */}
            <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{quiz.title}</h1>
                    {timeLeft !== null && (
                        <div className={`flex items-center gap-2 font-mono text-lg font-bold px-4 py-2 rounded-md ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
                            <Clock className="h-5 w-5" />
                            {formatTime(timeLeft)}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                        <span>{Math.round(progress)}% completed</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                </div>
            </div>

            {/* Question Area */}
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <QuizQuestionRenderer
                        question={currentQuestion}
                        userAnswer={responses[currentQuestion.id]}
                        onAnswerChange={handleAnswerChange}
                    />
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0 || isSubmitting}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                {currentQuestionIndex === questions.length - 1 ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Quiz"} <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        disabled={isSubmitting}
                    >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
