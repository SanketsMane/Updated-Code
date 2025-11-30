"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Brain,
  Target,
  Clock,
  DollarSign,
  BookOpen,
  Eye,
  Headphones,
  Hand,
  FileText,
  Settings,
  Sparkles,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UserPreferences {
  categories: string[];
  difficulty: string[];
  priceRange: [number, number];
  learningStyle: 'Visual' | 'Auditory' | 'Kinesthetic' | 'Reading';
  timeAvailability: 'Low' | 'Medium' | 'High';
  goals: string[];
  topics: string[];
  languages: string[];
  notifications: boolean;
}

const CATEGORIES = [
  "Programming & Development",
  "Business & Marketing", 
  "Design & Creative",
  "Data Science & Analytics",
  "Health & Fitness",
  "Language Learning",
  "Music & Arts",
  "Photography & Video",
  "Personal Development",
  "Science & Engineering"
];

const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

const LEARNING_GOALS = [
  "Career advancement",
  "Skill development",
  "Personal interest",
  "Academic requirements",
  "Certification",
  "Job transition",
  "Entrepreneurship",
  "Creative expression"
];

const LEARNING_STYLES = [
  {
    value: 'Visual',
    label: 'Visual Learner',
    description: 'Learn best through images, diagrams, and videos',
    icon: Eye
  },
  {
    value: 'Auditory',
    label: 'Auditory Learner', 
    description: 'Learn best through listening and discussions',
    icon: Headphones
  },
  {
    value: 'Kinesthetic',
    label: 'Hands-on Learner',
    description: 'Learn best through practice and experimentation',
    icon: Hand
  },
  {
    value: 'Reading',
    label: 'Reading/Writing Learner',
    description: 'Learn best through text and written materials',
    icon: FileText
  }
];

interface PreferencesSetupProps {
  initialPreferences?: Partial<UserPreferences>;
  onSave?: (preferences: UserPreferences) => void;
  isInitialSetup?: boolean;
}

export function PreferencesSetup({ 
  initialPreferences = {}, 
  onSave, 
  isInitialSetup = false 
}: PreferencesSetupProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    categories: [],
    difficulty: [],
    priceRange: [0, 500],
    learningStyle: 'Visual',
    timeAvailability: 'Medium',
    goals: [],
    topics: [],
    languages: ['English'],
    notifications: true,
    ...initialPreferences
  });
  
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(isInitialSetup);

  const steps = [
    {
      title: "Learning Interests",
      description: "What topics interest you most?",
      icon: BookOpen,
      content: <InterestsStep preferences={preferences} setPreferences={setPreferences} />
    },
    {
      title: "Learning Style",
      description: "How do you prefer to learn?",
      icon: Brain,
      content: <LearningStyleStep preferences={preferences} setPreferences={setPreferences} />
    },
    {
      title: "Goals & Budget",
      description: "What are your learning goals?",
      icon: Target,
      content: <GoalsStep preferences={preferences} setPreferences={setPreferences} />
    },
    {
      title: "Time & Preferences",
      description: "How much time can you dedicate?",
      icon: Clock,
      content: <TimeStep preferences={preferences} setPreferences={setPreferences} />
    }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences })
      });

      if (!response.ok) throw new Error('Failed to save preferences');

      toast.success('Preferences saved successfully!');
      onSave?.(preferences);
      setOpen(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const isStepComplete = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return preferences.categories.length > 0;
      case 1: return !!preferences.learningStyle;
      case 2: return preferences.goals.length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const canProceed = isStepComplete(step);
  const isLastStep = step === steps.length - 1;

  if (!isInitialSetup) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Learning Preferences
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI Learning Preferences
            </DialogTitle>
            <DialogDescription>
              Help us personalize your learning experience with AI-powered recommendations
            </DialogDescription>
          </DialogHeader>
          
          <SetupContent 
            steps={steps}
            step={step}
            setStep={setStep}
            canProceed={canProceed}
            isLastStep={isLastStep}
            saving={saving}
            handleSave={handleSave}
            isStepComplete={isStepComplete}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl">Personalize Your Learning</CardTitle>
          <CardDescription>
            Help us create AI-powered course recommendations tailored just for you
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SetupContent 
            steps={steps}
            step={step}
            setStep={setStep}
            canProceed={canProceed}
            isLastStep={isLastStep}
            saving={saving}
            handleSave={handleSave}
            isStepComplete={isStepComplete}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function SetupContent({ 
  steps, 
  step, 
  setStep, 
  canProceed, 
  isLastStep, 
  saving, 
  handleSave, 
  isStepComplete 
}: any) {
  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        {steps.map((s: any, index: number) => (
          <div key={index} className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
              index === step 
                ? "bg-blue-600 text-white"
                : isStepComplete(index)
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
            )}>
              {isStepComplete(index) && index !== step ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-12 h-0.5 mx-2",
                isStepComplete(index) ? "bg-green-600" : "bg-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Current step */}
      <div className="min-h-[400px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            {React.createElement(steps[step].icon, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" })}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{steps[step].title}</h3>
            <p className="text-sm text-muted-foreground">{steps[step].description}</p>
          </div>
        </div>
        
        {steps[step].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {isLastStep ? (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {saving ? "Saving..." : "Complete Setup"}
              <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function InterestsStep({ preferences, setPreferences }: any) {
  const handleCategoryToggle = (category: string) => {
    const updated = preferences.categories.includes(category)
      ? preferences.categories.filter((c: string) => c !== category)
      : [...preferences.categories, category];
    
    setPreferences({ ...preferences, categories: updated });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Select your areas of interest</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Choose 3-5 categories that match your learning interests
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={preferences.categories.includes(category) ? "default" : "outline"}
            onClick={() => handleCategoryToggle(category)}
            className="justify-start h-auto p-3 text-sm"
          >
            {category}
          </Button>
        ))}
      </div>

      {preferences.categories.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Selected: {preferences.categories.length} categories
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {preferences.categories.map((category: string) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LearningStyleStep({ preferences, setPreferences }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">How do you learn best?</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Select your preferred learning style to get better recommendations
        </p>
      </div>

      <div className="grid gap-3">
        {LEARNING_STYLES.map((style) => (
          <Button
            key={style.value}
            variant={preferences.learningStyle === style.value ? "default" : "outline"}
            onClick={() => setPreferences({ ...preferences, learningStyle: style.value })}
            className="justify-start h-auto p-4 text-left"
          >
            <div className="flex items-start gap-3">
              <style.icon className="h-5 w-5 mt-0.5" />
              <div>
                <div className="font-medium">{style.label}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {style.description}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

function GoalsStep({ preferences, setPreferences }: any) {
  const handleGoalToggle = (goal: string) => {
    const updated = preferences.goals.includes(goal)
      ? preferences.goals.filter((g: string) => g !== goal)
      : [...preferences.goals, goal];
    
    setPreferences({ ...preferences, goals: updated });
  };

  const handleDifficultyToggle = (level: string) => {
    const updated = preferences.difficulty.includes(level)
      ? preferences.difficulty.filter((d: string) => d !== level)
      : [...preferences.difficulty, level];
    
    setPreferences({ ...preferences, difficulty: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">What are your learning goals?</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Select all that apply
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          {LEARNING_GOALS.map((goal) => (
            <Button
              key={goal}
              variant={preferences.goals.includes(goal) ? "default" : "outline"}
              onClick={() => handleGoalToggle(goal)}
              className="justify-start text-sm h-9"
            >
              {goal}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Preferred difficulty levels</Label>
        <p className="text-sm text-muted-foreground mb-4">
          What skill levels are you comfortable with?
        </p>
        
        <div className="flex gap-2">
          {DIFFICULTY_LEVELS.map((level) => (
            <Button
              key={level}
              variant={preferences.difficulty.includes(level) ? "default" : "outline"}
              onClick={() => handleDifficultyToggle(level)}
              className="text-sm"
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">
          Budget range: ${preferences.priceRange[0]} - ${preferences.priceRange[1]}
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          What's your preferred price range for courses?
        </p>
        
        <Slider
          value={preferences.priceRange}
          onValueChange={(value: number[]) => 
            setPreferences({ ...preferences, priceRange: value as [number, number] })
          }
          max={1000}
          step={25}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Free</span>
          <span>$1000+</span>
        </div>
      </div>
    </div>
  );
}

function TimeStep({ preferences, setPreferences }: any) {
  const timeOptions = [
    {
      value: 'Low',
      label: '1-5 hours per week',
      description: 'Casual learning, flexible schedule'
    },
    {
      value: 'Medium', 
      label: '5-15 hours per week',
      description: 'Regular learning routine'
    },
    {
      value: 'High',
      label: '15+ hours per week',
      description: 'Intensive learning, career focused'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Time availability</Label>
        <p className="text-sm text-muted-foreground mb-4">
          How much time can you dedicate to learning each week?
        </p>
        
        <div className="space-y-2">
          {timeOptions.map((option) => (
            <Button
              key={option.value}
              variant={preferences.timeAvailability === option.value ? "default" : "outline"}
              onClick={() => setPreferences({ ...preferences, timeAvailability: option.value })}
              className="w-full justify-start h-auto p-4 text-left"
            >
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {option.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={preferences.notifications}
          onCheckedChange={(checked) => 
            setPreferences({ ...preferences, notifications: checked })
          }
        />
        <Label className="text-sm">
          Enable AI-powered course recommendations and learning reminders
        </Label>
      </div>

      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-blue-800 dark:text-blue-200">Ready to start!</span>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Your preferences will help our AI recommend the most relevant courses for your learning journey.
        </p>
      </div>
    </div>
  );
}