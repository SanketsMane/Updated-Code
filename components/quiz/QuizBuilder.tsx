"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Brain, 
  Plus, 
  Settings, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle,
  HelpCircle,
  FileText,
  List,
  RotateCcw,
  Trash2,
  Edit,
  Save,
  ArrowUp,
  ArrowDown,
  Copy,
  Play,
  BarChart3,
  Users,
  Target,
  Award,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { QuestionBuilder } from "./QuestionBuilder";
import { QuizPreview } from "./QuizPreview";

export interface QuizQuestion {
  id: string;
  type: 'MultipleChoice' | 'TrueFalse' | 'ShortAnswer' | 'LongAnswer' | 'FillInTheBlank' | 'Matching' | 'Ordering';
  question: string;
  explanation?: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  position: number;
  questionData: any;
  isRequired: boolean;
  partialCredit: boolean;
}

export interface QuizData {
  id?: string;
  title: string;
  description?: string;
  instructions?: string;
  courseId?: string;
  chapterId?: string;
  lessonId?: string;
  timeLimit?: number;
  passingScore: number;
  maxAttempts: number;
  showResults: boolean;
  showCorrectAnswers: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  availableFrom?: Date;
  availableTo?: Date;
  isPublished: boolean;
  isActive: boolean;
  questions: QuizQuestion[];
}

interface QuizBuilderProps {
  initialData?: Partial<QuizData>;
  courseId?: string;
  chapterId?: string;
  lessonId?: string;
  onSave?: (quiz: QuizData) => Promise<void>;
  onCancel?: () => void;
}

export function QuizBuilder({ 
  initialData,
  courseId,
  chapterId, 
  lessonId,
  onSave,
  onCancel 
}: QuizBuilderProps) {
  const [quiz, setQuiz] = useState<QuizData>({
    title: "",
    description: "",
    instructions: "",
    courseId,
    chapterId,
    lessonId,
    timeLimit: undefined,
    passingScore: 70,
    maxAttempts: 3,
    showResults: true,
    showCorrectAnswers: false,
    randomizeQuestions: false,
    randomizeOptions: false,
    isPublished: false,
    isActive: true,
    questions: [],
    ...initialData
  });

  const [activeTab, setActiveTab] = useState("details");
  const [selectedQuestion, setSelectedQuestion] = useState<QuizQuestion | null>(null);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!quiz.title.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    if (quiz.questions.length === 0) {
      toast.error("At least one question is required");
      return;
    }

    setSaving(true);
    try {
      await onSave?.(quiz);
      toast.success("Quiz saved successfully!");
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = (question: QuizQuestion) => {
    const newQuestion = {
      ...question,
      id: crypto.randomUUID(),
      position: quiz.questions.length
    };
    
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    
    setShowQuestionDialog(false);
    setSelectedQuestion(null);
  };

  const updateQuestion = (updatedQuestion: QuizQuestion) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    }));
    
    setShowQuestionDialog(false);
    setSelectedQuestion(null);
  };

  const deleteQuestion = (questionId: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions
        .filter(q => q.id !== questionId)
        .map((q, index) => ({ ...q, position: index }))
    }));
  };

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    setQuiz(prev => {
      const questions = [...prev.questions];
      const currentIndex = questions.findIndex(q => q.id === questionId);
      
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === questions.length - 1)
      ) {
        return prev;
      }
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [questions[currentIndex], questions[newIndex]] = [questions[newIndex], questions[currentIndex]];
      
      // Update positions
      questions.forEach((q, index) => {
        q.position = index;
      });
      
      return { ...prev, questions };
    });
  };

  const duplicateQuestion = (question: QuizQuestion) => {
    const duplicated = {
      ...question,
      id: crypto.randomUUID(),
      question: `${question.question} (Copy)`,
      position: quiz.questions.length
    };
    
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, duplicated]
    }));
  };

  const getTotalPoints = () => {
    return quiz.questions.reduce((total, q) => total + q.points, 0);
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Quiz Builder
          </h1>
          <p className="text-muted-foreground">
            Create interactive quizzes with multiple question types and advanced settings
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={saving || quiz.questions.length === 0}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Quiz"}
          </Button>
          
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Quiz Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Questions</p>
                <p className="text-2xl font-bold">{quiz.questions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Total Points</p>
                <p className="text-2xl font-bold">{getTotalPoints()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Time Limit</p>
                <p className="text-2xl font-bold">
                  {quiz.timeLimit ? `${quiz.timeLimit}m` : "None"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Passing Score</p>
                <p className="text-2xl font-bold">{quiz.passingScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Quiz Details</TabsTrigger>
          <TabsTrigger value="questions">
            Questions ({quiz.questions.length})
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Quiz Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Set up the basic details for your quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title *</Label>
                  <Input
                    id="title"
                    value={quiz.title}
                    onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter quiz title..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[quiz.passingScore]}
                      onValueChange={(value) => setQuiz(prev => ({ ...prev, passingScore: value[0] }))}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{quiz.passingScore}%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={quiz.description || ""}
                  onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the quiz..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={quiz.instructions || ""}
                  onChange={(e) => setQuiz(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Instructions for students taking the quiz..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Quiz Questions</h3>
              <p className="text-sm text-muted-foreground">
                Add and manage questions for your quiz
              </p>
            </div>
            
            <Button
              onClick={() => {
                setSelectedQuestion(null);
                setShowQuestionDialog(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </div>

          {quiz.questions.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="font-semibold">No questions yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start by adding your first question to the quiz
                    </p>
                    <Button
                      onClick={() => {
                        setSelectedQuestion(null);
                        setShowQuestionDialog(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add First Question
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {quiz.questions.map((question, index) => (
                <Card key={question.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Q{index + 1}
                          </Badge>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            {getQuestionTypeIcon(question.type)}
                            <span className="text-xs">{question.type}</span>
                          </div>
                          <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {question.points} pts
                          </Badge>
                        </div>
                        
                        <h4 className="font-medium mb-1 line-clamp-2">
                          {question.question}
                        </h4>
                        
                        {question.explanation && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {question.explanation}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveQuestion(question.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveQuestion(question.id, 'down')}
                          disabled={index === quiz.questions.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateQuestion(question)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedQuestion(question);
                            setShowQuestionDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timing & Attempts */}
            <Card>
              <CardHeader>
                <CardTitle>Timing & Attempts</CardTitle>
                <CardDescription>
                  Configure time limits and attempt restrictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Time Limit (minutes)</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={quiz.timeLimit !== undefined}
                      onCheckedChange={(checked) => 
                        setQuiz(prev => ({ 
                          ...prev, 
                          timeLimit: checked ? 60 : undefined 
                        }))
                      }
                    />
                    {quiz.timeLimit !== undefined && (
                      <Input
                        type="number"
                        value={quiz.timeLimit}
                        onChange={(e) => setQuiz(prev => ({ 
                          ...prev, 
                          timeLimit: parseInt(e.target.value) || 60 
                        }))}
                        min={1}
                        max={480}
                        className="w-24"
                      />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {quiz.timeLimit ? `${quiz.timeLimit} minutes` : "No limit"}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Maximum Attempts</Label>
                  <Select
                    value={quiz.maxAttempts.toString()}
                    onValueChange={(value) => setQuiz(prev => ({ 
                      ...prev, 
                      maxAttempts: parseInt(value) 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 attempt</SelectItem>
                      <SelectItem value="2">2 attempts</SelectItem>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="-1">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Display Options */}
            <Card>
              <CardHeader>
                <CardTitle>Display Options</CardTitle>
                <CardDescription>
                  Configure how results and feedback are shown
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Results Immediately</Label>
                    <p className="text-sm text-muted-foreground">
                      Display score after submission
                    </p>
                  </div>
                  <Switch
                    checked={quiz.showResults}
                    onCheckedChange={(checked) => setQuiz(prev => ({ 
                      ...prev, 
                      showResults: checked 
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Correct Answers</Label>
                    <p className="text-sm text-muted-foreground">
                      Reveal correct answers after completion
                    </p>
                  </div>
                  <Switch
                    checked={quiz.showCorrectAnswers}
                    onCheckedChange={(checked) => setQuiz(prev => ({ 
                      ...prev, 
                      showCorrectAnswers: checked 
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Randomize Questions</Label>
                    <p className="text-sm text-muted-foreground">
                      Shuffle question order for each attempt
                    </p>
                  </div>
                  <Switch
                    checked={quiz.randomizeQuestions}
                    onCheckedChange={(checked) => setQuiz(prev => ({ 
                      ...prev, 
                      randomizeQuestions: checked 
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Randomize Options</Label>
                    <p className="text-sm text-muted-foreground">
                      Shuffle answer choices for multiple choice
                    </p>
                  </div>
                  <Switch
                    checked={quiz.randomizeOptions}
                    onCheckedChange={(checked) => setQuiz(prev => ({ 
                      ...prev, 
                      randomizeOptions: checked 
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Status</CardTitle>
              <CardDescription>
                Control quiz availability and publication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Published</Label>
                  <p className="text-sm text-muted-foreground">
                    Make quiz available to students
                  </p>
                </div>
                <Switch
                  checked={quiz.isPublished}
                  onCheckedChange={(checked) => setQuiz(prev => ({ 
                    ...prev, 
                    isPublished: checked 
                  }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active</Label>
                  <p className="text-sm text-muted-foreground">
                    Quiz can be taken by students
                  </p>
                </div>
                <Switch
                  checked={quiz.isActive}
                  onCheckedChange={(checked) => setQuiz(prev => ({ 
                    ...prev, 
                    isActive: checked 
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Question Builder Dialog */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedQuestion ? "Edit Question" : "Add New Question"}
            </DialogTitle>
            <DialogDescription>
              Create or modify quiz questions with various question types
            </DialogDescription>
          </DialogHeader>
          
          <QuestionBuilder
            initialData={selectedQuestion}
            onSave={selectedQuestion ? updateQuestion : addQuestion}
            onCancel={() => {
              setShowQuestionDialog(false);
              setSelectedQuestion(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Quiz Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quiz Preview</DialogTitle>
            <DialogDescription>
              Preview how your quiz will appear to students
            </DialogDescription>
          </DialogHeader>
          
          <QuizPreview quiz={quiz} />
        </DialogContent>
      </Dialog>
    </div>
  );
}