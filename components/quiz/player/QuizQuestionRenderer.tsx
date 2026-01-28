"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuizQuestion {
    id: string;
    type: string;
    question: string;
    points: number;
    questionData: any;
}

interface QuizQuestionRendererProps {
    question: QuizQuestion;
    userAnswer: any;
    onAnswerChange: (answer: any) => void;
    readOnly?: boolean;
}

export function QuizQuestionRenderer({
    question,
    userAnswer,
    onAnswerChange,
    readOnly = false
}: QuizQuestionRendererProps) {

    const renderMultipleChoice = () => {
        const options = question.questionData.options || [];
        // Support single selection for now, unless multiple correct answers handling is added later
        // Assuming single select if type is MultipleChoice

        return (
            <RadioGroup
                value={userAnswer as string}
                onValueChange={!readOnly ? onAnswerChange : undefined}
                className="space-y-3"
            >
                {options.map((option: any) => (
                    <div key={option.id} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                        <RadioGroupItem value={option.id} id={option.id} disabled={readOnly} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                            {option.text}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        );
    };

    const renderTrueFalse = () => {
        return (
            <RadioGroup
                value={userAnswer === true ? "true" : userAnswer === false ? "false" : ""}
                onValueChange={(val) => !readOnly && onAnswerChange(val === "true")}
                className="space-y-3"
            >
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                    <RadioGroupItem value="true" id="tf-true" disabled={readOnly} />
                    <Label htmlFor="tf-true" className="flex-1 cursor-pointer">True</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                    <RadioGroupItem value="false" id="tf-false" disabled={readOnly} />
                    <Label htmlFor="tf-false" className="flex-1 cursor-pointer">False</Label>
                </div>
            </RadioGroup>
        );
    };

    const renderShortAnswer = () => {
        return (
            <Input
                value={userAnswer || ""}
                onChange={(e) => !readOnly && onAnswerChange(e.target.value)}
                placeholder="Type your answer here..."
                disabled={readOnly}
                className="max-w-md"
            />
        );
    };

    const renderLongAnswer = () => {
        return (
            <Textarea
                value={userAnswer || ""}
                onChange={(e) => !readOnly && onAnswerChange(e.target.value)}
                placeholder="Type your detailed answer here..."
                rows={5}
                disabled={readOnly}
            />
        );
    };

    // Fallback for types not yet fully supported
    const renderUnsupported = () => (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
            This question type ({question.type}) is not yet supported in the player.
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-xl font-semibold leading-relaxed">
                    {question.question}
                </h3>
                <div className="text-sm text-muted-foreground mt-2">
                    Points: {question.points}
                </div>
            </div>

            <Card className="border-none shadow-sm bg-slate-50/50 dark:bg-slate-900/20">
                <CardContent className="pt-6">
                    {question.type === 'MultipleChoice' && renderMultipleChoice()}
                    {question.type === 'TrueFalse' && renderTrueFalse()}
                    {question.type === 'ShortAnswer' && renderShortAnswer()}
                    {question.type === 'LongAnswer' && renderLongAnswer()}
                    {!['MultipleChoice', 'TrueFalse', 'ShortAnswer', 'LongAnswer'].includes(question.type) && renderUnsupported()}
                </CardContent>
            </Card>
        </div>
    );
}
