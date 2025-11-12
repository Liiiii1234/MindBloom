import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QUESTIONNAIRES } from '@/lib/questionnaires';
import { AlertCircle, ArrowLeft, CheckCircle2, Lightbulb } from 'lucide-react';

export default function Questionnaire() {
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const questionnaire = selectedQuestionnaire
    ? QUESTIONNAIRES.find(q => q.id === selectedQuestionnaire)
    : null;

  const currentQuestion = questionnaire ? questionnaire.questions[currentQuestionIndex] : null;

  const handleResponse = (value: number) => {
    if (currentQuestion) {
      setResponses({
        ...responses,
        [currentQuestion.id]: value,
      });
    }
  };

  const calculateScore = () => {
    let total = 0;
    questionnaire?.questions.forEach((question) => {
      total += responses[question.id] || 0;
    });
    return total;
  };

  const getInterpretation = () => {
    const score = calculateScore();
    const guide = questionnaire?.interpretationGuide.find(
      (g) => score >= g.scoreRange.min && score <= g.scoreRange.max
    );
    return guide;
  };

  const handleNext = () => {
    if (currentQuestionIndex < (questionnaire?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleReset = () => {
    setSelectedQuestionnaire(null);
    setCurrentQuestionIndex(0);
    setResponses({});
    setShowResults(false);
  };

  if (!selectedQuestionnaire) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mental Health Questionnaires</h1>
          <p className="text-muted-foreground mt-1">
            Complete validated psychological assessments to understand your mental wellness
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {QUESTIONNAIRES.map((q) => (
            <Card
              key={q.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedQuestionnaire(q.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{q.title}</CardTitle>
                    <CardDescription className="mt-2">{q.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {q.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {q.questions.length} questions • ~5 minutes
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const interpretation = getInterpretation();

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="outline" onClick={handleReset} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Questionnaires</span>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span>{questionnaire?.title} - Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-6 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
              <div>
                <p className="text-sm text-muted-foreground">Your Score</p>
                <p className="text-5xl font-bold">{score}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Out of</p>
                <p className="text-3xl font-bold">
                  {(questionnaire?.questions.length || 0) * 3}
                </p>
              </div>
            </div>

            {interpretation && (
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-lg text-blue-900 dark:text-blue-100">
                  {interpretation.level}
                </AlertTitle>
                <AlertDescription className="text-blue-800 dark:text-blue-200 mt-2">
                  {interpretation.advice}
                </AlertDescription>
              </Alert>
            )}

            <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
              <Lightbulb className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900 dark:text-green-100">
                Professional Guidance
              </AlertTitle>
              <AlertDescription className="text-green-800 dark:text-green-200 mt-2">
                <div className="space-y-2 text-sm">
                  <p>
                    • This questionnaire is a screening tool, not a diagnosis. Please consult with a
                    mental health professional for proper evaluation.
                  </p>
                  <p>
                    • If you're experiencing crisis or suicidal thoughts, contact emergency services
                    or a crisis helpline immediately.
                  </p>
                  <p>
                    • Consider discussing these results with your healthcare provider or mental
                    health professional.
                  </p>
                  <p>
                    • Regular monitoring and professional support can help you achieve better mental
                    wellness.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h3 className="font-semibold">Your Responses</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {questionnaire?.questions.map((q, index) => (
                  <div key={q.id} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium">{index + 1}. {q.text}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Response: {responses[q.id] || 0}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleReset} className="w-full">
              Take Another Questionnaire
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const progress = ((currentQuestionIndex + 1) / (questionnaire?.questions.length || 1)) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="outline" onClick={handleReset} className="flex items-center space-x-2">
        <ArrowLeft className="w-4 h-4" />
        <span>Exit Questionnaire</span>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{questionnaire?.title}</CardTitle>
          <CardDescription>
            Question {currentQuestionIndex + 1} of {questionnaire?.questions.length}
          </CardDescription>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-6">{currentQuestion.text}</h3>

            {currentQuestion.type === 'likert' && (
              <div className="space-y-6">
                <Slider
                  value={[responses[currentQuestion.id] || 0]}
                  onValueChange={(value) => handleResponse(value[0])}
                  min={0}
                  max={3}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{currentQuestion.minLabel}</span>
                  <span>{currentQuestion.maxLabel}</span>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    Response: {responses[currentQuestion.id] || 0}
                  </Badge>
                </div>
              </div>
            )}

            {currentQuestion.type === 'multiChoice' && (
              <RadioGroup
                value={String(responses[currentQuestion.id] || '')}
                onValueChange={(value) => handleResponse(parseInt(value))}
              >
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                      <RadioGroupItem value={String(index)} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {currentQuestion.type === 'yesNo' && (
              <RadioGroup
                value={String(responses[currentQuestion.id] ?? '')}
                onValueChange={(value) => handleResponse(parseInt(value))}
              >
                <div className="space-y-3">
                  {['No', 'Yes'].map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                      <RadioGroupItem value={String(index)} id={`yesno-${index}`} />
                      <Label htmlFor={`yesno-${index}`} className="cursor-pointer flex-1">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex-1"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={responses[currentQuestion.id] === undefined}
              className="flex-1"
            >
              {currentQuestionIndex === (questionnaire?.questions.length || 0) - 1
                ? 'Complete'
                : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
