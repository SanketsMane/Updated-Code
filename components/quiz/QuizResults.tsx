"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  Target,
  Clock,
  Brain,
  BarChart3,
  TrendingUp,
  Award,
  Star,
  Eye,
  RotateCcw,
  Download,
  Share2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Users,
  BookOpen,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";

interface QuizResult {
  id: string;
  quiz: {
    id: string;
    title: string;
    description?: string;
    passingScore: number;
    totalPoints: number;
    showCorrectAnswers: boolean;
  };
  attempt: {
    id: string;
    userId: string;
    startedAt: Date;
    submittedAt: Date;
    score: number;
    totalPoints: number;
    status: string;
    timeSpent: number;
    responses: QuizResponse[];
  };
  questions: QuizQuestion[];
  analytics: {
    correctCount: number;
    incorrectCount: number;
    partialCount: number;
    skippedCount: number;
    averageTimePerQuestion: number;
    difficultyBreakdown: Record<string, { correct: number; total: number }>;
    questionTypeBreakdown: Record<string, { correct: number; total: number }>;
  };
  classAnalytics?: {
    averageScore: number;
    passRate: number;
    completionRate: number;
    topPerformers: Array<{ userId: string; userName: string; score: number }>;
  };
}

interface QuizResponse {
  questionId: string;
  answer: any;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number;
  correctAnswer?: any;
}

interface QuizQuestion {
  id: string;
  type: string;
  question: string;
  explanation?: string;
  points: number;
  difficulty: string;
  questionData: any;
}

interface QuizResultsProps {
  result: QuizResult;
  showClassAnalytics?: boolean;
  canRetake?: boolean;
  onRetake?: () => void;
  onViewFeedback?: () => void;
}

export function QuizResults({
  result,
  showClassAnalytics = false,
  canRetake = false,
  onRetake,
  onViewFeedback
}: QuizResultsProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);

  const { quiz, attempt, questions, analytics, classAnalytics } = result;
  const scorePercentage = Math.round((attempt.score / attempt.totalPoints) * 100);
  const passed = scorePercentage >= quiz.passingScore;
  const grade = getLetterGrade(scorePercentage);

  function getLetterGrade(percentage: number): string {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 65) return 'D';
    return 'F';
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getQuestionResponse = (questionId: string) => {
    return attempt.responses.find(r => r.questionId === questionId);
  };

  const renderScoreCard = () => (
    <Card className={`${passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
            {passed ? (
              <Trophy className="h-12 w-12 text-green-600" />
            ) : (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-2">{scorePercentage}%</h2>
            <p className={`text-lg font-semibold ${passed ? 'text-green-700' : 'text-red-700'}`}>
              {passed ? 'Congratulations! You Passed!' : 'You Need More Practice'}
            </p>
            <p className="text-muted-foreground">
              Grade: <span className="font-semibold">{grade}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {attempt.score}
              </p>
              <p className="text-sm text-muted-foreground">Points Earned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {attempt.totalPoints}
              </p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            {canRetake && (
              <Button onClick={onRetake} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Retake Quiz
              </Button>
            )}

            <Button onClick={onViewFeedback} variant="outline" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              View Feedback
            </Button>

            <Button
              onClick={() => setShowDetailedAnalytics(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderQuickStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-600">{analytics.correctCount}</p>
          <p className="text-sm text-muted-foreground">Correct</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-red-600">{analytics.incorrectCount}</p>
          <p className="text-sm text-muted-foreground">Incorrect</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-600">
            {formatTime(analytics.averageTimePerQuestion)}
          </p>
          <p className="text-sm text-muted-foreground">Avg. Time</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-purple-600">
            {Math.round((analytics.correctCount / questions.length) * 100)}%
          </p>
          <p className="text-sm text-muted-foreground">Accuracy</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuestionReview = () => (
    <div className="space-y-4">
      {questions.map((question, index) => {
        const response = getQuestionResponse(question.id);
        const isCorrect = response?.isCorrect || false;
        const pointsEarned = response?.pointsEarned || 0;

        return (
          <Card key={question.id} className={`${isCorrect ? 'border-green-200' :
              pointsEarned > 0 ? 'border-yellow-200' : 'border-red-200'
            }`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Q{index + 1}</Badge>
                    <Badge className={`text-xs ${question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          question.difficulty === 'Hard' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                      }`}>
                      {question.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {pointsEarned}/{question.points} pts
                    </Badge>
                  </div>

                  <CardTitle className="text-base font-medium leading-relaxed">
                    {question.question}
                  </CardTitle>
                </div>

                <div className="ml-4">
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : pointsEarned > 0 ? (
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {/* Student's Answer */}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Your Answer:</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {renderStudentAnswer(question, response)}
                  </div>
                </div>

                {/* Correct Answer (if quiz settings allow) */}
                {quiz.showCorrectAnswers && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Correct Answer:</Label>
                    <div className="mt-1 p-2 bg-green-50 rounded-md">
                      {renderCorrectAnswer(question)}
                    </div>
                  </div>
                )}

                {/* Explanation */}
                {question.explanation && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Explanation</p>
                        <p className="text-sm text-blue-800 mt-1">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Time Spent */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Time spent: {formatTime(response?.timeSpent || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderStudentAnswer = (question: QuizQuestion, response?: QuizResponse) => {
    if (!response || response.answer === null || response.answer === undefined) {
      return <span className="text-muted-foreground italic">No answer provided</span>;
    }

    switch (question.type) {
      case 'MultipleChoice':
        const selectedOption = question.questionData?.options?.find((opt: any) => opt.id === response.answer);
        return selectedOption?.text || 'Invalid selection';

      case 'TrueFalse':
        return response.answer === 'true' ? 'True' : 'False';

      case 'ShortAnswer':
        return response.answer;

      case 'LongAnswer':
        return (
          <div className="max-h-32 overflow-y-auto">
            {response.answer}
          </div>
        );

      case 'FillInTheBlank':
        if (typeof response.answer === 'object') {
          return Object.values(response.answer).join(', ');
        }
        return response.answer;

      default:
        return JSON.stringify(response.answer);
    }
  };

  const renderCorrectAnswer = (question: QuizQuestion) => {
    switch (question.type) {
      case 'MultipleChoice':
        const correctOptions = question.questionData?.options?.filter((opt: any) => opt.isCorrect) || [];
        return correctOptions.map((opt: any) => opt.text).join(', ');

      case 'TrueFalse':
        return question.questionData?.correctAnswer ? 'True' : 'False';

      case 'ShortAnswer':
        return question.questionData?.correctAnswers?.join(' / ') || 'Multiple acceptable answers';

      case 'LongAnswer':
        return question.questionData?.sampleAnswer || 'See explanation for sample answer';

      case 'FillInTheBlank':
        const blanks = question.questionData?.blanks || [];
        return blanks.map((blank: any, index: number) =>
          `Blank ${index + 1}: ${blank.correctAnswers.join(' / ')}`
        ).join('\n');

      default:
        return 'See explanation';
    }
  };

  const renderClassAnalytics = () => {
    if (!showClassAnalytics || !classAnalytics) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Class Performance
          </CardTitle>
          <CardDescription>
            See how you performed compared to your classmates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(classAnalytics.averageScore)}%
              </p>
              <p className="text-sm text-muted-foreground">Class Average</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {Math.round(classAnalytics.passRate)}%
              </p>
              <p className="text-sm text-muted-foreground">Pass Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(classAnalytics.completionRate)}%
              </p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Your Performance vs Class</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Class Average</span>
                <span>{Math.round(classAnalytics.averageScore)}%</span>
              </div>
              <Progress value={classAnalytics.averageScore} className="h-2" />

              <div className="flex items-center justify-between text-sm">
                <span>Your Score</span>
                <span className={scorePercentage > classAnalytics.averageScore ? 'text-green-600' : 'text-red-600'}>
                  {scorePercentage}%
                </span>
              </div>
              <Progress
                value={scorePercentage}
                className={`h-2 ${scorePercentage > classAnalytics.averageScore ? 'text-green-600' : 'text-red-600'}`}
              />
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                {scorePercentage > classAnalytics.averageScore
                  ? `Great job! You scored ${scorePercentage - Math.round(classAnalytics.averageScore)} points above the class average.`
                  : `You scored ${Math.round(classAnalytics.averageScore) - scorePercentage} points below the class average. Consider reviewing the material.`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          {quiz.title} - Results
        </h1>
        <p className="text-muted-foreground">
          Submitted on {new Date(attempt.submittedAt).toLocaleDateString()} at {new Date(attempt.submittedAt).toLocaleTimeString()}
        </p>
      </div>

      {/* Score Card */}
      {renderScoreCard()}

      {/* Quick Stats */}
      {renderQuickStats()}

      <Tabs defaultValue="review" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="review">Question Review</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="class">Class Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="review" className="space-y-6">
          {renderQuestionReview()}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Difficulty Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance by Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.difficultyBreakdown).map(([difficulty, stats]) => (
                    <div key={difficulty}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{difficulty}</span>
                        <span className="text-sm text-muted-foreground">
                          {stats.correct}/{stats.total}
                        </span>
                      </div>
                      <Progress
                        value={(stats.correct / stats.total) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Question Type Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance by Question Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.questionTypeBreakdown).map(([type, stats]) => (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {type.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {stats.correct}/{stats.total}
                        </span>
                      </div>
                      <Progress
                        value={(stats.correct / stats.total) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="class" className="space-y-6">
          {renderClassAnalytics()}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 pt-6 border-t">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Results
        </Button>

        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share Results
        </Button>

        <Button variant="outline" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Study Resources
        </Button>
      </div>
    </div>
  );
}