"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  List
} from "lucide-react";
import { QuizData } from "./QuizBuilder";

interface QuizPreviewProps {
  quiz: QuizData;
}

export function QuizPreview({ quiz }: QuizPreviewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
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
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTotalPoints = () => {
    return quiz.questions.reduce((total, q) => total + q.points, 0);
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const renderQuestion = (question: any, index: number) => {
    const questionAnswer = answers[question.id];

    const renderMultipleChoice = () => {
      const options = question.questionData?.options || [];
      
      return (
        <div className="space-y-3">
          {options.map((option: any, optionIndex: number) => (
            <div key={option.id} className="flex items-center space-x-3">
              <input
                type="radio"
                id={`q${index}-option${optionIndex}`}
                name={`question-${question.id}`}
                value={option.id}
                checked={questionAnswer === option.id}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <Label 
                htmlFor={`q${index}-option${optionIndex}`}
                className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-gray-50"
              >
                <Badge variant="outline" className="min-w-[24px] text-center">
                  {String.fromCharCode(65 + optionIndex)}
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
              id={`q${index}-true`}
              name={`question-${question.id}`}
              value="true"
              checked={questionAnswer === "true"}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <Label 
              htmlFor={`q${index}-true`}
              className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-gray-50"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>True</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id={`q${index}-false`}
              name={`question-${question.id}`}
              value="false"
              checked={questionAnswer === "false"}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <Label 
              htmlFor={`q${index}-false`}
              className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-gray-50"
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
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
            className="w-full"
          />
          {question.questionData?.caseSensitive && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Case sensitive
            </p>
          )}
        </div>
      );
    };

    const renderLongAnswer = () => {
      const maxWords = question.questionData?.maxWords;
      const wordCount = questionAnswer ? questionAnswer.split(/\s+/).filter((word: string) => word.length > 0).length : 0;
      
      return (
        <div className="space-y-2">
          <Textarea
            value={questionAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your detailed answer..."
            rows={6}
            className="w-full"
          />
          {maxWords && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{wordCount} words</span>
              <span className={wordCount > maxWords ? "text-red-600" : ""}>
                Max: {maxWords} words
              </span>
            </div>
          )}
        </div>
      );
    };

    const renderFillInTheBlank = () => {
      const text = question.questionData?.text || '';
      const blanks = question.questionData?.blanks || [];
      
      // Split text by blanks and render with input fields
      const parts = text.split('___');
      
      return (
        <div className="space-y-4">
          <div className="text-base leading-relaxed">
            {parts.map((part: any, partIndex: number) => (
              <span key={partIndex}>
                {part}
                {partIndex < blanks.length && (
                  <Input
                    value={questionAnswer?.[partIndex] || ''}
                    onChange={(e) => {
                      const newAnswer = { ...questionAnswer };
                      newAnswer[partIndex] = e.target.value;
                      handleAnswerChange(question.id, newAnswer);
                    }}
                    className="inline-block w-32 mx-1 h-8 text-center"
                    placeholder="___"
                  />
                )}
              </span>
            ))}
          </div>
          
          {blanks.some((blank: any) => blank.caseSensitive) && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Some blanks are case sensitive
            </p>
          )}
        </div>
      );
    };

    return (
      <Card key={question.id} className="w-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-sm">
                  Question {index + 1}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  {getQuestionTypeIcon(question.type)}
                  <span className="text-xs">{question.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
                <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {question.points} {question.points === 1 ? 'point' : 'points'}
                </Badge>
                {question.isRequired && (
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
              
              <CardTitle className="text-lg leading-relaxed">
                {question.question}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {question.type === 'MultipleChoice' && renderMultipleChoice()}
          {question.type === 'TrueFalse' && renderTrueFalse()}
          {question.type === 'ShortAnswer' && renderShortAnswer()}
          {question.type === 'LongAnswer' && renderLongAnswer()}
          {question.type === 'FillInTheBlank' && renderFillInTheBlank()}
          
          {question.explanation && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Explanation</p>
                  <p className="text-sm text-blue-800 mt-1">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (quiz.questions.length === 0) {
    return (
      <div className="text-center py-8">
        <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Questions Added</h3>
        <p className="text-muted-foreground">
          Add some questions to see the quiz preview
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
        </div>
        
        {quiz.description && (
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {quiz.description}
          </p>
        )}
      </div>

      {/* Quiz Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-lg font-semibold">{quiz.questions.length}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-lg font-semibold">{getTotalPoints()}</p>
                <p className="text-sm text-muted-foreground">Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-lg font-semibold">
                  {quiz.timeLimit ? `${quiz.timeLimit}m` : "∞"}
                </p>
                <p className="text-sm text-muted-foreground">Time Limit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Award className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-lg font-semibold">{quiz.passingScore}%</p>
                <p className="text-sm text-muted-foreground">Passing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Instructions */}
      {quiz.instructions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">
              {quiz.instructions}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {getAnsweredCount()} of {quiz.questions.length} answered
            </span>
          </div>
          <Progress 
            value={(getAnsweredCount() / quiz.questions.length) * 100} 
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* Timer (if time limited) */}
      {timeRemaining !== null && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 text-orange-800">
              <Timer className="h-5 w-5" />
              <span className="text-lg font-mono font-semibold">
                {formatTime(timeRemaining)}
              </span>
              <span className="text-sm">remaining</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {quiz.questions.map((question, index) => renderQuestion(question, index))}
      </div>

      {/* Submit Section */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-800">
              <CheckCircle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Ready to Submit?</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
              <div className="flex items-center justify-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>{getAnsweredCount()} / {quiz.questions.length} answered</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Target className="h-4 w-4" />
                <span>{getTotalPoints()} total points</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Award className="h-4 w-4" />
                <span>{quiz.passingScore}% to pass</span>
              </div>
            </div>
            
            <Button size="lg" className="bg-green-600 hover:bg-green-700" disabled>
              Submit Quiz (Preview Mode)
            </Button>
            
            <p className="text-sm text-green-600">
              This is a preview. Students will see a submit button here.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="font-medium">Maximum Attempts:</Label>
              <p className="text-muted-foreground">
                {quiz.maxAttempts === -1 ? 'Unlimited' : quiz.maxAttempts}
              </p>
            </div>
            <div>
              <Label className="font-medium">Show Results:</Label>
              <p className="text-muted-foreground">
                {quiz.showResults ? 'Immediately' : 'Hidden'}
              </p>
            </div>
            <div>
              <Label className="font-medium">Show Correct Answers:</Label>
              <p className="text-muted-foreground">
                {quiz.showCorrectAnswers ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <Label className="font-medium">Question Order:</Label>
              <p className="text-muted-foreground">
                {quiz.randomizeQuestions ? 'Randomized' : 'Fixed'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}