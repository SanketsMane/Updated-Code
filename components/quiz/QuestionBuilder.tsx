"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  GripVertical,
  Check,
  X,
  Save,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";
import { QuizQuestion } from "./QuizBuilder";

interface QuestionBuilderProps {
  initialData?: QuizQuestion | null;
  onSave: (question: QuizQuestion) => void;
  onCancel: () => void;
}

interface MultipleChoiceData {
  options: { id: string; text: string; isCorrect: boolean }[];
}

interface TrueFalseData {
  correctAnswer: boolean;
}

interface ShortAnswerData {
  correctAnswers: string[];
  caseSensitive: boolean;
}

interface LongAnswerData {
  sampleAnswer?: string;
  maxWords?: number;
}

interface FillInTheBlankData {
  text: string;
  blanks: { id: string; correctAnswers: string[]; caseSensitive: boolean }[];
}

interface MatchingData {
  pairs: { id: string; left: string; right: string }[];
}

interface OrderingData {
  items: { id: string; text: string; correctOrder: number }[];
}

export function QuestionBuilder({ initialData, onSave, onCancel }: QuestionBuilderProps) {
  const [question, setQuestion] = useState<Partial<QuizQuestion>>({
    type: 'MultipleChoice',
    question: '',
    explanation: '',
    points: 1,
    difficulty: 'Medium',
    position: 0,
    isRequired: true,
    partialCredit: false,
    questionData: { options: [] },
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateQuestion = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!question.question?.trim()) {
      newErrors.question = "Question text is required";
    }

    if (!question.points || question.points < 0) {
      newErrors.points = "Points must be greater than 0";
    }

    // Type-specific validation
    switch (question.type) {
      case 'MultipleChoice':
        const mcData = question.questionData as MultipleChoiceData;
        if (!mcData?.options?.length || mcData.options.length < 2) {
          newErrors.options = "At least 2 options are required";
        } else if (!mcData.options.some(opt => opt.isCorrect)) {
          newErrors.options = "At least one correct answer is required";
        }
        break;

      case 'ShortAnswer':
        const saData = question.questionData as ShortAnswerData;
        if (!saData?.correctAnswers?.length || !saData.correctAnswers.some(ans => ans.trim())) {
          newErrors.correctAnswers = "At least one correct answer is required";
        }
        break;

      case 'FillInTheBlank':
        const fibData = question.questionData as FillInTheBlankData;
        if (!fibData?.text?.includes('___') && !fibData?.blanks?.length) {
          newErrors.fillInBlank = "Text must contain blanks (___) or define blank positions";
        }
        break;

      case 'Matching':
        const matchData = question.questionData as MatchingData;
        if (!matchData?.pairs?.length || matchData.pairs.length < 2) {
          newErrors.matching = "At least 2 pairs are required";
        }
        break;

      case 'Ordering':
        const orderData = question.questionData as OrderingData;
        if (!orderData?.items?.length || orderData.items.length < 2) {
          newErrors.ordering = "At least 2 items are required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateQuestion()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    onSave(question as QuizQuestion);
  };

  const updateQuestionData = (updates: any) => {
    setQuestion(prev => ({
      ...prev,
      questionData: { ...prev.questionData, ...updates }
    }));
  };

  // Multiple Choice Question Builder
  const MultipleChoiceBuilder = () => {
    const data = question.questionData as MultipleChoiceData || { options: [] };

    const addOption = () => {
      const newOption = {
        id: crypto.randomUUID(),
        text: '',
        isCorrect: false
      };
      updateQuestionData({
        options: [...data.options, newOption]
      });
    };

    const updateOption = (optionId: string, updates: Partial<typeof data.options[0]>) => {
      updateQuestionData({
        options: data.options.map(opt =>
          opt.id === optionId ? { ...opt, ...updates } : opt
        )
      });
    };

    const removeOption = (optionId: string) => {
      updateQuestionData({
        options: data.options.filter(opt => opt.id !== optionId)
      });
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Answer Options</Label>
          <Button type="button" onClick={addOption} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>

        <div className="space-y-3">
          {data.options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-3">
              <Badge variant="secondary" className="min-w-[24px] text-center">
                {String.fromCharCode(65 + index)}
              </Badge>

              <Input
                value={option.text}
                onChange={(e) => updateOption(option.id, { text: e.target.value })}
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                className="flex-1"
              />

              <div className="flex items-center gap-2">
                <Switch
                  checked={option.isCorrect}
                  onCheckedChange={(checked) => updateOption(option.id, { isCorrect: checked })}
                />
                <Label className="text-sm">Correct</Label>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOption(option.id)}
                disabled={data.options.length <= 2}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {data.options.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p>No options added yet. Click "Add Option" to start.</p>
          </div>
        )}

        {errors.options && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.options}
          </p>
        )}
      </div>
    );
  };

  // True/False Question Builder
  const TrueFalseBuilder = () => {
    const data = question.questionData as TrueFalseData || { correctAnswer: true };

    return (
      <div className="space-y-4">
        <Label>Correct Answer</Label>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="true"
              name="trueFalse"
              checked={data.correctAnswer === true}
              onChange={() => updateQuestionData({ correctAnswer: true })}
              className="h-4 w-4 text-blue-600"
            />
            <Label htmlFor="true" className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              True
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="false"
              name="trueFalse"
              checked={data.correctAnswer === false}
              onChange={() => updateQuestionData({ correctAnswer: false })}
              className="h-4 w-4 text-blue-600"
            />
            <Label htmlFor="false" className="flex items-center gap-2">
              <X className="h-4 w-4 text-red-600" />
              False
            </Label>
          </div>
        </div>
      </div>
    );
  };

  // Short Answer Question Builder
  const ShortAnswerBuilder = () => {
    const data = question.questionData as ShortAnswerData || {
      correctAnswers: [''],
      caseSensitive: false
    };

    const addAnswer = () => {
      updateQuestionData({
        correctAnswers: [...data.correctAnswers, '']
      });
    };

    const updateAnswer = (index: number, value: string) => {
      const newAnswers = [...data.correctAnswers];
      newAnswers[index] = value;
      updateQuestionData({ correctAnswers: newAnswers });
    };

    const removeAnswer = (index: number) => {
      updateQuestionData({
        correctAnswers: data.correctAnswers.filter((_, i) => i !== index)
      });
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Accepted Answers</Label>
          <Button type="button" onClick={addAnswer} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Answer
          </Button>
        </div>

        <div className="space-y-2">
          {data.correctAnswers.map((answer, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={answer}
                onChange={(e) => updateAnswer(index, e.target.value)}
                placeholder="Correct answer..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAnswer(index)}
                disabled={data.correctAnswers.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Case Sensitive</Label>
            <p className="text-sm text-muted-foreground">
              Answers must match exact capitalization
            </p>
          </div>
          <Switch
            checked={data.caseSensitive}
            onCheckedChange={(checked) => updateQuestionData({ caseSensitive: checked })}
          />
        </div>

        {errors.correctAnswers && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.correctAnswers}
          </p>
        )}
      </div>
    );
  };

  // Long Answer Question Builder
  const LongAnswerBuilder = () => {
    const data = question.questionData as LongAnswerData || {};

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Sample Answer (Optional)</Label>
          <Textarea
            value={data.sampleAnswer || ''}
            onChange={(e) => updateQuestionData({ sampleAnswer: e.target.value })}
            placeholder="Provide a sample answer for grading reference..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Maximum Words (Optional)</Label>
          <Input
            type="number"
            value={data.maxWords || ''}
            onChange={(e) => updateQuestionData({
              maxWords: e.target.value ? parseInt(e.target.value) : undefined
            })}
            placeholder="e.g., 500"
            min={1}
          />
        </div>
      </div>
    );
  };

  // Fill in the Blank Question Builder
  const FillInTheBlankBuilder = () => {
    const data = question.questionData as FillInTheBlankData || {
      text: '',
      blanks: []
    };

    const updateBlank = (blankId: string, updates: any) => {
      updateQuestionData({
        blanks: data.blanks.map(blank =>
          blank.id === blankId ? { ...blank, ...updates } : blank
        )
      });
    };

    const addBlankAnswer = (blankId: string) => {
      const blank = data.blanks.find(b => b.id === blankId);
      if (blank) {
        updateBlank(blankId, {
          correctAnswers: [...blank.correctAnswers, '']
        });
      }
    };

    const updateBlankAnswer = (blankId: string, answerIndex: number, value: string) => {
      const blank = data.blanks.find(b => b.id === blankId);
      if (blank) {
        const newAnswers = [...blank.correctAnswers];
        newAnswers[answerIndex] = value;
        updateBlank(blankId, { correctAnswers: newAnswers });
      }
    };

    const removeBlankAnswer = (blankId: string, answerIndex: number) => {
      const blank = data.blanks.find(b => b.id === blankId);
      if (blank && blank.correctAnswers.length > 1) {
        updateBlank(blankId, {
          correctAnswers: blank.correctAnswers.filter((_, i) => i !== answerIndex)
        });
      }
    };

    // Auto-detect blanks from text
    const detectBlanks = () => {
      const blankCount = (data.text.match(/___/g) || []).length;
      const newBlanks = Array.from({ length: blankCount }, (_, i) => ({
        id: crypto.randomUUID(),
        correctAnswers: [''],
        caseSensitive: false
      }));
      updateQuestionData({ blanks: newBlanks });
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Question Text with Blanks</Label>
          <Textarea
            value={data.text}
            onChange={(e) => {
              updateQuestionData({ text: e.target.value });
              // Auto-detect blanks when text changes
              setTimeout(detectBlanks, 100);
            }}
            placeholder="Enter text with ___ for blanks. Example: The capital of France is ___."
            rows={3}
          />
          <p className="text-sm text-muted-foreground">
            Use ___ (three underscores) to mark blank spaces
          </p>
        </div>

        {data.blanks.length > 0 && (
          <div className="space-y-4">
            <Label>Blank Answers</Label>
            {data.blanks.map((blank, blankIndex) => (
              <Card key={blank.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Blank {blankIndex + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {blank.correctAnswers.map((answer, answerIndex) => (
                    <div key={answerIndex} className="flex items-center gap-2">
                      <Input
                        value={answer}
                        onChange={(e) => updateBlankAnswer(blank.id, answerIndex, e.target.value)}
                        placeholder="Correct answer..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBlankAnswer(blank.id, answerIndex)}
                        disabled={blank.correctAnswers.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addBlankAnswer(blank.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Answer
                    </Button>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={blank.caseSensitive}
                        onCheckedChange={(checked) => updateBlank(blank.id, { caseSensitive: checked })}
                      />
                      <Label className="text-sm">Case Sensitive</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {errors.fillInBlank && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.fillInBlank}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="question" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="question">Question</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="question" className="space-y-6">
          {/* Question Type */}
          <div className="space-y-2">
            <Label>Question Type</Label>
            <Select
              value={question.type}
              onValueChange={(value) => setQuestion(prev => ({
                ...prev,
                type: value as any,
                questionData: value === 'MultipleChoice' ? { options: [] } :
                  value === 'TrueFalse' ? { correctAnswer: true } :
                    value === 'ShortAnswer' ? { correctAnswers: [''], caseSensitive: false } :
                      value === 'LongAnswer' ? {} :
                        value === 'FillInTheBlank' ? { text: '', blanks: [] } :
                          value === 'Matching' ? { pairs: [] } :
                            value === 'Ordering' ? { items: [] } : {}
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MultipleChoice">Multiple Choice</SelectItem>
                <SelectItem value="TrueFalse">True/False</SelectItem>
                <SelectItem value="ShortAnswer">Short Answer</SelectItem>
                <SelectItem value="LongAnswer">Long Answer</SelectItem>
                <SelectItem value="FillInTheBlank">Fill in the Blank</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="questionText">Question *</Label>
            <Textarea
              id="questionText"
              value={question.question}
              onChange={(e) => setQuestion(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Enter your question here..."
              rows={3}
              className={errors.question ? "border-red-500" : ""}
            />
            {errors.question && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.question}
              </p>
            )}
          </div>

          {/* Question Type Specific Builders */}
          <div>
            {question.type === 'MultipleChoice' && MultipleChoiceBuilder()}
            {question.type === 'TrueFalse' && TrueFalseBuilder()}
            {question.type === 'ShortAnswer' && ShortAnswerBuilder()}
            {question.type === 'LongAnswer' && LongAnswerBuilder()}
            {question.type === 'FillInTheBlank' && FillInTheBlankBuilder()}
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              value={question.explanation || ''}
              onChange={(e) => setQuestion(prev => ({ ...prev, explanation: e.target.value }))}
              placeholder="Provide an explanation that will be shown after answering..."
              rows={2}
            />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Points */}
          <div className="space-y-2">
            <Label>Points</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[question.points || 1]}
                onValueChange={(value) => setQuestion(prev => ({ ...prev, points: value[0] }))}
                min={1}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-sm font-medium">{question.points || 1}</span>
            </div>
            {errors.points && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.points}
              </p>
            )}
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <Select
              value={question.difficulty}
              onValueChange={(value) => setQuestion(prev => ({
                ...prev,
                difficulty: value as any
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Required Question</Label>
                <p className="text-sm text-muted-foreground">
                  Students must answer this question
                </p>
              </div>
              <Switch
                checked={question.isRequired}
                onCheckedChange={(checked) => setQuestion(prev => ({
                  ...prev,
                  isRequired: checked
                }))}
              />
            </div>

            {question.type === 'MultipleChoice' && (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Partial Credit</Label>
                  <p className="text-sm text-muted-foreground">
                    Award points for partially correct answers
                  </p>
                </div>
                <Switch
                  checked={question.partialCredit}
                  onCheckedChange={(checked) => setQuestion(prev => ({
                    ...prev,
                    partialCredit: checked
                  }))}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Question
        </Button>
      </div>
    </div>
  );
}