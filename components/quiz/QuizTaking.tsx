"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Target,
  Brain,
  Timer,
  Users,
  BarChart3,
  Award,
  HelpCircle,
  FileText,
  List,
  ChevronLeft,
  ChevronRight,
  Flag,
  Eye,
  EyeOff,
  Save,
  Send,
  RotateCcw,
  Pause,
  Play
} from "lucide-react";
import { toast } from "sonner";

interface QuizQuestion {
  id: string;
  type: 'MultipleChoice' | 'TrueFalse' | 'ShortAnswer' | 'LongAnswer' | 'FillInTheBlank';
  question: string;
  explanation?: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  position: number;
  questionData: any;
  isRequired: boolean;
}

interface QuizAttempt {
  id?: string;
  quizId: string;
  userId: string;
  startedAt: Date;
  submittedAt?: Date;
  score?: number;
  totalPoints: number;
  status: 'InProgress' | 'Submitted' | 'Abandoned';
  timeSpent: number;
  responses: QuizResponse[];
}

interface QuizResponse {
  questionId: string;
  answer: any;
  isCorrect?: boolean;
  pointsEarned?: number;
  timeSpent: number;
}

interface QuizTakingProps {
  quiz: {
    id: string;
    title: string;
    description?: string;
    instructions?: string;
    timeLimit?: number;
    passingScore: number;
    maxAttempts: number;
    showResults: boolean;
    showCorrectAnswers: boolean;
    randomizeQuestions: boolean;
    randomizeOptions: boolean;
    questions: QuizQuestion[];
  };
  userId: string;
  onComplete: (attempt: QuizAttempt) => Promise<void>;
  onSaveProgress: (attempt: Partial<QuizAttempt>) => Promise<void>;
  existingAttempt?: QuizAttempt;
}

export function QuizTaking({ 
  quiz, 
  userId, 
  onComplete, 
  onSaveProgress, 
  existingAttempt 
}: QuizTakingProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(
    existingAttempt?.responses?.reduce((acc, response) => {
      acc[response.questionId] = response.answer;
      return acc;
    }, {} as Record<string, any>) || {}
  );
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    quiz.timeLimit ? quiz.timeLimit * 60 : null
  );
  const [startTime] = useState(existingAttempt?.startedAt || new Date());
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<string, Date>>({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const questions = quiz.randomizeQuestions 
    ? [...quiz.questions].sort(() => Math.random() - 0.5)
    : quiz.questions;

  const currentQuestion = questions[currentQuestionIndex];

  // Timer management
  useEffect(() => {
    if (!timeRemaining || isPaused) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        
        if (prev && prev <= 300 && !showTimeWarning) { // 5 minutes warning
          setShowTimeWarning(true);
          toast.warning("Only 5 minutes remaining!");
        }
        
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeRemaining, isPaused, showTimeWarning]);

  // Question timer tracking
  useEffect(() => {
    if (currentQuestion && !questionStartTimes[currentQuestion.id]) {
      setQuestionStartTimes(prev => ({
        ...prev,
        [currentQuestion.id]: new Date()
      }));
    }
  }, [currentQuestion, questionStartTimes]);

  // Auto-save progress
  useEffect(() => {
    const autoSave = async () => {
      if (Object.keys(answers).length === 0) return;
      
      setAutoSaveStatus('saving');
      
      try {
        const responses: QuizResponse[] = Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
          timeSpent: getQuestionTimeSpent(questionId),
        }));

        await onSaveProgress({
          quizId: quiz.id,
          userId,
          startedAt: startTime,
          status: 'InProgress',
          timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
          responses
        });
        
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setAutoSaveStatus('idle');
      }
    };

    const autoSaveInterval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(autoSaveInterval);
  }, [answers, quiz.id, userId, startTime, onSaveProgress]);

  const getQuestionTimeSpent = (questionId: string): number => {
    const startTime = questionStartTimes[questionId];
    if (!startTime) return 0;
    return Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const getAnsweredCount = () => {
    return questions.filter(q => 
      answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== ''
    ).length;
  };

  const getRequiredUnanswered = () => {
    return questions.filter(q => 
      q.isRequired && 
      (answers[q.id] === undefined || answers[q.id] === null || answers[q.id] === '')
    );
  };

  const handleAutoSubmit = async () => {
    toast.error("Time's up! Quiz submitted automatically.");
    await handleSubmit(true);
  };

  const handleSubmit = async (autoSubmit = false) => {
    const requiredUnanswered = getRequiredUnanswered();
    
    if (!autoSubmit && requiredUnanswered.length > 0) {
      toast.error(`Please answer all required questions (${requiredUnanswered.length} remaining)`);
      return;
    }

    setIsSubmitting(true);

    try {
      const responses: QuizResponse[] = questions.map(question => ({
        questionId: question.id,
        answer: answers[question.id] || null,
        timeSpent: getQuestionTimeSpent(question.id),
      }));

      const totalTimeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);

      const attempt: QuizAttempt = {
        quizId: quiz.id,
        userId,
        startedAt: startTime,
        submittedAt: new Date(),
        status: 'Submitted',
        timeSpent: totalTimeSpent,
        totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
        responses
      };

      await onComplete(attempt);
      toast.success("Quiz submitted successfully!");
      
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error("Failed to submit quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderQuestionContent = () => {
    if (!currentQuestion) return null;

    const questionAnswer = answers[currentQuestion.id];

    const renderMultipleChoice = () => {
      const options = currentQuestion.questionData?.options || [];
      const shuffledOptions = quiz.randomizeOptions 
        ? [...options].sort(() => Math.random() - 0.5)
        : options;

      return (
        <div className="space-y-3">
          {shuffledOptions.map((option: any, index: number) => (
            <div key={option.id} className="flex items-center space-x-3">
              <input
                type="radio"
                id={`option-${option.id}`}
                name={`question-${currentQuestion.id}`}
                value={option.id}
                checked={questionAnswer === option.id}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <Label 
                htmlFor={`option-${option.id}`}
                className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <Badge variant="outline" className="min-w-[24px] text-center">
                  {String.fromCharCode(65 + index)}
                </Badge>
                <span>{option.text}</span>
              </Label>
            </div>
          ))}
        </div>
      );
    };

    const renderTrueFalse = () => {
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="true"
              name={`question-${currentQuestion.id}`}
              value="true"
              checked={questionAnswer === "true"}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <Label 
              htmlFor="true"
              className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>True</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="false"
              name={`question-${currentQuestion.id}`}
              value="false"
              checked={questionAnswer === "false"}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <Label 
              htmlFor="false"
              className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <XCircle className="h-4 w-4 text-red-600" />
              <span>False</span>
            </Label>
          </div>
        </div>
      );
    };

    const renderShortAnswer = () => {
      return (
        <div className="space-y-2">
          <Input
            value={questionAnswer || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            placeholder="Enter your answer..."
            className="w-full text-base p-4"
          />
          {currentQuestion.questionData?.caseSensitive && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              This answer is case sensitive
            </p>
          )}
        </div>
      );
    };

    const renderLongAnswer = () => {
      const maxWords = currentQuestion.questionData?.maxWords;
      const wordCount = questionAnswer ? 
        questionAnswer.split(/\s+/).filter((word: string) => word.length > 0).length : 0;
      
      return (
        <div className="space-y-2">
          <Textarea
            value={questionAnswer || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            placeholder="Enter your detailed answer..."
            rows={8}
            className="w-full text-base"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{wordCount} words</span>
            {maxWords && (
              <span className={wordCount > maxWords ? "text-red-600" : ""}>
                Maximum: {maxWords} words
              </span>
            )}
          </div>
        </div>
      );
    };

    const renderFillInTheBlank = () => {
      const text = currentQuestion.questionData?.text || '';
      const blanks = currentQuestion.questionData?.blanks || [];
      const parts = text.split('___');
      
      return (
        <div className="space-y-4">
          <div className="text-lg leading-relaxed p-4 bg-gray-50 rounded-lg">
            {parts.map((part: any, partIndex: number) => (
              <span key={partIndex}>
                {part}
                {partIndex < blanks.length && (
                  <Input
                    value={questionAnswer?.[partIndex] || ''}
                    onChange={(e) => {
                      const newAnswer = { ...questionAnswer };
                      newAnswer[partIndex] = e.target.value;
                      handleAnswerChange(currentQuestion.id, newAnswer);
                    }}
                    className="inline-block w-40 mx-2 h-10 text-center font-medium border-b-2 border-blue-500 bg-white"
                    placeholder="___"
                  />
                )}
              </span>
            ))}
          </div>
          
          {blanks.some((blank: any) => blank.caseSensitive) && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Some answers are case sensitive
            </p>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {currentQuestion.type === 'MultipleChoice' && renderMultipleChoice()}
        {currentQuestion.type === 'TrueFalse' && renderTrueFalse()}
        {currentQuestion.type === 'ShortAnswer' && renderShortAnswer()}
        {currentQuestion.type === 'LongAnswer' && renderLongAnswer()}
        {currentQuestion.type === 'FillInTheBlank' && renderFillInTheBlank()}
      </div>
    );
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'MultipleChoice': return <List className="h-4 w-4" />;
      case 'TrueFalse': return <CheckCircle className="h-4 w-4" />;
      case 'ShortAnswer': return <FileText className="h-4 w-4" />;
      case 'LongAnswer': return <FileText className="h-4 w-4" />;
      case 'FillInTheBlank': return <HelpCircle className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                {quiz.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Auto-save indicator */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Save className="h-3 w-3" />
                {autoSaveStatus === 'saving' && 'Saving...'}
                {autoSaveStatus === 'saved' && 'Saved'}
                {autoSaveStatus === 'idle' && 'Auto-save enabled'}
              </div>
              
              {/* Timer */}
              {timeRemaining !== null && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  timeRemaining <= 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  <Timer className="h-4 w-4" />
                  <span className="font-mono font-semibold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
              
              {/* Pause/Resume (only if time limited) */}
              {timeRemaining !== null && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPaused(!isPaused)}
                  className="flex items-center gap-1"
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
              )}
            </div>
          </div>
          
          {/* Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
              <span>Progress: {getAnsweredCount()} of {questions.length} answered</span>
              <span>{Math.round((getAnsweredCount() / questions.length) * 100)}% complete</span>
            </div>
            <Progress value={(getAnsweredCount() / questions.length) * 100} className="h-2" />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Question Navigation Sidebar */}
        <div className="w-64 bg-white border-r min-h-screen p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <List className="h-4 w-4" />
            Questions
          </h3>
          
          <div className="space-y-2">
            {questions.map((question, index) => {
              const isAnswered = answers[question.id] !== undefined && 
                                answers[question.id] !== null && 
                                answers[question.id] !== '';
              const isFlagged = flaggedQuestions.has(question.id);
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={question.id}
                  onClick={() => handleQuestionNavigation(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    isCurrent ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={isCurrent ? "default" : "outline"}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                      >
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">
                          Q{index + 1}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {question.points} pts
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1">
                      {isAnswered && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {isFlagged && (
                        <Flag className="h-4 w-4 text-orange-600" />
                      )}
                      {question.isRequired && (
                        <AlertCircle className="h-3 w-3 text-red-600" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Answered:</span>
              <Badge variant="secondary">{getAnsweredCount()}/{questions.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Flagged:</span>
              <Badge variant="outline">{flaggedQuestions.size}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Required:</span>
              <Badge variant="destructive" className="text-xs">
                {getRequiredUnanswered().length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="flex-1 p-6">
          {isPaused ? (
            <Card className="max-w-md mx-auto mt-12">
              <CardContent className="text-center p-8">
                <Pause className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Quiz Paused</h3>
                <p className="text-muted-foreground mb-4">
                  Your quiz is paused. Click resume to continue.
                </p>
                <Button onClick={() => setIsPaused(false)}>
                  <Play className="h-4 w-4 mr-2" />
                  Resume Quiz
                </Button>
              </CardContent>
            </Card>
          ) : currentQuestion ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">
                        Question {currentQuestionIndex + 1}
                      </Badge>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        {getQuestionTypeIcon(currentQuestion.type)}
                        <span className="text-xs">
                          {currentQuestion.type.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <Badge className={`text-xs ${getDifficultyColor(currentQuestion.difficulty)}`}>
                        {currentQuestion.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {currentQuestion.points} points
                      </Badge>
                      {currentQuestion.isRequired && (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-xl leading-relaxed">
                      {currentQuestion.question}
                    </CardTitle>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFlag(currentQuestion.id)}
                    className={`ml-4 ${
                      flaggedQuestions.has(currentQuestion.id) 
                        ? 'text-orange-600 bg-orange-50' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {renderQuestionContent()}
              </CardContent>
            </Card>
          ) : null}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={() => setShowSubmitDialog(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Are you sure you want to submit your quiz? Once submitted, you cannot make changes.
                </p>
                
                <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Questions answered:</span>
                    <span className="font-medium">{getAnsweredCount()} of {questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions flagged:</span>
                    <span className="font-medium">{flaggedQuestions.size}</span>
                  </div>
                  {getRequiredUnanswered().length > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Required unanswered:</span>
                      <span className="font-medium">{getRequiredUnanswered().length}</span>
                    </div>
                  )}
                </div>
                
                {getRequiredUnanswered().length > 0 && (
                  <p className="text-red-600 text-sm">
                    Warning: You have {getRequiredUnanswered().length} required questions that are not answered.
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Continue Quiz
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleSubmit()}
              disabled={isSubmitting || getRequiredUnanswered().length > 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time Warning Dialog */}
      <AlertDialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              Time Warning
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have less than 5 minutes remaining to complete the quiz. 
              The quiz will be automatically submitted when time runs out.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowTimeWarning(false)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}