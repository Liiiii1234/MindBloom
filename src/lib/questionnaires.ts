export interface QuestionnaireQuestion {
  id: string;
  text: string;
  type: 'likert' | 'multiChoice' | 'yesNo';
  options?: string[];
  minLabel?: string;
  maxLabel?: string;
}

export interface Questionnaire {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: QuestionnaireQuestion[];
  interpretationGuide: {
    scoreRange: { min: number; max: number };
    level: string;
    advice: string;
  }[];
}

export const QUESTIONNAIRES: Questionnaire[] = [
  {
    id: 'phq9',
    title: 'PHQ-9: Patient Health Questionnaire',
    description: 'Screen for depression and mood disorders',
    category: 'Depression',
    questions: [
      {
        id: 'q1',
        text: 'Little interest or pleasure in doing things',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
      {
        id: 'q2',
        text: 'Feeling down, depressed, or hopeless',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
      {
        id: 'q3',
        text: 'Trouble falling or staying asleep, or sleeping too much',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
      {
        id: 'q4',
        text: 'Feeling tired or having little energy',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
      {
        id: 'q5',
        text: 'Poor appetite or overeating',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
      {
        id: 'q6',
        text: 'Feeling bad about yourself — or that you are a failure or have let your family down',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
      {
        id: 'q7',
        text: 'Trouble concentrating on things, such as reading the newspaper or watching television',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
      {
        id: 'q8',
        text: 'Moving or speaking so slowly that others have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
      {
        id: 'q9',
        text: 'Thoughts that you would be better off dead or of hurting yourself in some way',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
    ],
    interpretationGuide: [
      {
        scoreRange: { min: 0, max: 4 },
        level: 'Minimal Depression',
        advice: 'Your mood appears to be generally healthy. Continue maintaining good self-care practices like regular exercise, sleep, and social connection.',
      },
      {
        scoreRange: { min: 5, max: 9 },
        level: 'Mild Depression',
        advice: 'You may be experiencing mild depressive symptoms. Consider speaking with a mental health professional and implementing positive lifestyle changes.',
      },
      {
        scoreRange: { min: 10, max: 14 },
        level: 'Moderate Depression',
        advice: 'You appear to be experiencing moderate depression. Please seek professional mental health support. Therapy and/or medication may be beneficial.',
      },
      {
        scoreRange: { min: 15, max: 19 },
        level: 'Moderately Severe Depression',
        advice: 'You are experiencing moderately severe depression. Professional mental health treatment is strongly recommended. Please contact a therapist or psychiatrist.',
      },
      {
        scoreRange: { min: 20, max: 27 },
        level: 'Severe Depression',
        advice: 'You are experiencing severe depression. This requires immediate professional attention. Please reach out to a mental health professional or crisis service right away.',
      },
    ],
  },
  {
    id: 'gad7',
    title: 'GAD-7: Generalized Anxiety Disorder',
    description: 'Assess symptoms of generalized anxiety',
    category: 'Anxiety',
    questions: [
      {
        id: 'q1',
        text: 'Feeling nervous, anxious, or on edge',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
      {
        id: 'q2',
        text: 'Not being able to stop or control worrying',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
      {
        id: 'q3',
        text: 'Worrying too much about different things',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
      {
        id: 'q4',
        text: 'Trouble relaxing',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
      {
        id: 'q5',
        text: 'Being so restless that it is hard to sit still',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
      {
        id: 'q6',
        text: 'Becoming easily annoyed or irritable',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
      {
        id: 'q7',
        text: 'Feeling afraid as if something awful might happen',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Nearly every day',
      },
    ],
    interpretationGuide: [
      {
        scoreRange: { min: 0, max: 4 },
        level: 'Minimal Anxiety',
        advice: 'Your anxiety levels appear normal. Continue with healthy coping strategies and stress management practices.',
      },
      {
        scoreRange: { min: 5, max: 9 },
        level: 'Mild Anxiety',
        advice: 'You may be experiencing mild anxiety. Try relaxation techniques like deep breathing, meditation, or physical exercise.',
      },
      {
        scoreRange: { min: 10, max: 14 },
        level: 'Moderate Anxiety',
        advice: 'You are experiencing moderate anxiety. Consider consulting a mental health professional for support and coping strategies.',
      },
      {
        scoreRange: { min: 15, max: 100 },
        level: 'Severe Anxiety',
        advice: 'You are experiencing severe anxiety. Professional mental health support is strongly recommended. Therapy and possibly medication can help.',
      },
    ],
  },
  {
    id: 'psqi',
    title: 'PSQI: Sleep Quality Index',
    description: 'Evaluate sleep quality and sleep disturbances',
    category: 'Sleep',
    questions: [
      {
        id: 'q1',
        text: 'What time have you usually gone to bed at night during the past month?',
        type: 'multiChoice',
        options: ['Before 9 PM', '9-10 PM', '10-11 PM', '11 PM-12 AM', 'After 12 AM'],
      },
      {
        id: 'q2',
        text: 'How many hours of actual sleep did you get at night?',
        type: 'multiChoice',
        options: ['More than 7 hours', '6-7 hours', '5-6 hours', 'Less than 5 hours'],
      },
      {
        id: 'q3',
        text: 'During the past month, how often have you taken medicine to help you sleep?',
        type: 'likert',
        minLabel: 'Never',
        maxLabel: 'Very often',
      },
      {
        id: 'q4',
        text: 'During the past month, how would you rate your sleep quality overall?',
        type: 'likert',
        minLabel: 'Very good',
        maxLabel: 'Very bad',
      },
      {
        id: 'q5',
        text: 'How often have you had trouble staying awake while driving, eating meals, or engaging in social activity?',
        type: 'likert',
        minLabel: 'Never',
        maxLabel: 'Very often',
      },
    ],
    interpretationGuide: [
      {
        scoreRange: { min: 0, max: 5 },
        level: 'Good Sleep Quality',
        advice: 'Your sleep quality is good. Maintain your healthy sleep habits and bedtime routine.',
      },
      {
        scoreRange: { min: 6, max: 10 },
        level: 'Fair Sleep Quality',
        advice: 'Your sleep quality could be improved. Consider establishing a consistent sleep schedule and sleep hygiene practices.',
      },
      {
        scoreRange: { min: 11, max: 100 },
        level: 'Poor Sleep Quality',
        advice: 'You are experiencing poor sleep quality. Consult a healthcare provider or sleep specialist for guidance and potential treatment options.',
      },
    ],
  },
  {
    id: 'pcl5',
    title: 'PCL-5: PTSD Checklist',
    description: 'Screen for post-traumatic stress disorder symptoms',
    category: 'Trauma',
    questions: [
      {
        id: 'q1',
        text: 'Repeated, disturbing, and unwanted memories of a stressful experience?',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Extremely',
      },
      {
        id: 'q2',
        text: 'Repeated, disturbing dreams of a stressful experience?',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Extremely',
      },
      {
        id: 'q3',
        text: 'Suddenly feeling or acting as if a stressful experience were happening again (as if you were reliving it)?',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Extremely',
      },
      {
        id: 'q4',
        text: 'Feeling very upset when reminded of a stressful experience?',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Extremely',
      },
      {
        id: 'q5',
        text: 'Having strong negative beliefs about yourself, other people, or the world?',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Extremely',
      },
      {
        id: 'q6',
        text: 'Blaming yourself or someone else for the stressful experience or what happened after it?',
        type: 'likert',
        minLabel: 'Not at all',
        maxLabel: 'Extremely',
      },
    ],
    interpretationGuide: [
      {
        scoreRange: { min: 0, max: 14 },
        level: 'Minimal PTSD Symptoms',
        advice: 'Your responses suggest minimal PTSD symptoms. Continue with self-care and seek support if symptoms develop.',
      },
      {
        scoreRange: { min: 15, max: 28 },
        level: 'Mild to Moderate PTSD Symptoms',
        advice: 'You may have some PTSD symptoms. Consider trauma-focused therapy such as cognitive processing therapy or prolonged exposure therapy.',
      },
      {
        scoreRange: { min: 29, max: 100 },
        level: 'Moderate to Severe PTSD Symptoms',
        advice: 'You appear to have significant PTSD symptoms. Professional trauma treatment is strongly recommended. Please contact a trauma specialist.',
      },
    ],
  },
  {
    id: 'audit',
    title: 'AUDIT: Alcohol Use Disorders',
    description: 'Identify alcohol abuse and dependence',
    category: 'Substance Use',
    questions: [
      {
        id: 'q1',
        text: 'How often do you have a drink containing alcohol?',
        type: 'multiChoice',
        options: ['Never', 'Monthly or less', '2-4 times a month', '2-3 times a week', '4+ times a week'],
      },
      {
        id: 'q2',
        text: 'How many drinks containing alcohol do you have on a typical day?',
        type: 'multiChoice',
        options: ['1-2', '3-4', '5-6', '7-9', '10 or more'],
      },
      {
        id: 'q3',
        text: 'How often do you have 6 or more drinks on one occasion?',
        type: 'likert',
        minLabel: 'Never',
        maxLabel: 'Daily or almost daily',
      },
      {
        id: 'q4',
        text: 'How often during the last year have you found that you were unable to stop drinking once you had started?',
        type: 'likert',
        minLabel: 'Never',
        maxLabel: 'Daily or almost daily',
      },
      {
        id: 'q5',
        text: 'How often during the last year have you failed to do what was normally expected from you because of drinking?',
        type: 'likert',
        minLabel: 'Never',
        maxLabel: 'Daily or almost daily',
      },
    ],
    interpretationGuide: [
      {
        scoreRange: { min: 0, max: 7 },
        level: 'Low Risk',
        advice: 'Your alcohol consumption appears to be at low risk. Continue responsible drinking practices.',
      },
      {
        scoreRange: { min: 8, max: 15 },
        level: 'Hazardous Use',
        advice: 'Your alcohol use shows signs of being hazardous. Consider reducing consumption and speaking with a healthcare provider.',
      },
      {
        scoreRange: { min: 16, max: 100 },
        level: 'Harmful Use or Dependence',
        advice: 'Your responses suggest harmful alcohol use or dependence. Professional support from addiction specialists is recommended.',
      },
    ],
  },
  {
    id: 'dass21',
    title: 'DASS-21: Depression Anxiety Stress Scales',
    description: 'Measure depression, anxiety, and stress levels',
    category: 'Mental Health',
    questions: [
      {
        id: 'q1',
        text: 'I found it hard to wind down',
        type: 'likert',
        minLabel: 'Did not apply to me at all',
        maxLabel: 'Applied to me very much',
      },
      {
        id: 'q2',
        text: 'I was aware of dryness of my mouth',
        type: 'likert',
        minLabel: 'Did not apply to me at all',
        maxLabel: 'Applied to me very much',
      },
      {
        id: 'q3',
        text: 'I could not experience positive feelings at all',
        type: 'likert',
        minLabel: 'Did not apply to me at all',
        maxLabel: 'Applied to me very much',
      },
      {
        id: 'q4',
        text: 'I experienced breathing difficulty',
        type: 'likert',
        minLabel: 'Did not apply to me at all',
        maxLabel: 'Applied to me very much',
      },
      {
        id: 'q5',
        text: 'I found it difficult to work up the initiative to do things',
        type: 'likert',
        minLabel: 'Did not apply to me at all',
        maxLabel: 'Applied to me very much',
      },
      {
        id: 'q6',
        text: 'I tended to over-react to situations',
        type: 'likert',
        minLabel: 'Did not apply to me at all',
        maxLabel: 'Applied to me very much',
      },
      {
        id: 'q7',
        text: 'I experienced trembling',
        type: 'likert',
        minLabel: 'Did not apply to me at all',
        maxLabel: 'Applied to me very much',
      },
    ],
    interpretationGuide: [
      {
        scoreRange: { min: 0, max: 9 },
        level: 'Normal',
        advice: 'Your mental health appears to be in good balance. Continue with healthy lifestyle practices.',
      },
      {
        scoreRange: { min: 10, max: 13 },
        level: 'Mild',
        advice: 'You may be experiencing mild symptoms. Self-care strategies and stress management may help.',
      },
      {
        scoreRange: { min: 14, max: 20 },
        level: 'Moderate',
        advice: 'Consider seeking professional support. A mental health professional can help address these concerns.',
      },
      {
        scoreRange: { min: 21, max: 100 },
        level: 'Severe',
        advice: 'Professional mental health treatment is recommended. Please reach out to a therapist or counselor.',
      },
    ],
  },
  {
    id: 'oasis',
    title: 'OASIS: Overall Anxiety Severity Index',
    description: 'Brief anxiety assessment tool',
    category: 'Anxiety',
    questions: [
      {
        id: 'q1',
        text: 'In the past week, how often have you been bothered by anxiety?',
        type: 'likert',
        minLabel: 'None',
        maxLabel: 'Every day',
      },
      {
        id: 'q2',
        text: 'In the past week, how intense or severe was your anxiety?',
        type: 'likert',
        minLabel: 'None',
        maxLabel: 'Extreme',
      },
      {
        id: 'q3',
        text: 'In the past week, how much did anxiety interfere with your work, school, or personal relationships?',
        type: 'likert',
        minLabel: 'None',
        maxLabel: 'Extreme',
      },
      {
        id: 'q4',
        text: 'In the past week, how much time did you spend worrying about various things?',
        type: 'likert',
        minLabel: 'None',
        maxLabel: 'All day long',
      },
    ],
    interpretationGuide: [
      {
        scoreRange: { min: 0, max: 8 },
        level: 'Minimal Anxiety',
        advice: 'Your anxiety levels are minimal. Maintain current coping strategies and self-care practices.',
      },
      {
        scoreRange: { min: 9, max: 12 },
        level: 'Mild Anxiety',
        advice: 'You may benefit from relaxation techniques and stress management strategies.',
      },
      {
        scoreRange: { min: 13, max: 16 },
        level: 'Moderate Anxiety',
        advice: 'Consider professional support. A therapist can help you develop coping strategies.',
      },
      {
        scoreRange: { min: 17, max: 24 },
        level: 'Severe Anxiety',
        advice: 'Professional mental health treatment is recommended. Please seek support from a mental health professional.',
      },
    ],
  },
  {
    id: 'rosenberg',
    title: 'Rosenberg Self-Esteem Scale',
    description: 'Measure global self-worth and self-esteem',
    category: 'Self-Esteem',
    questions: [
      {
        id: 'q1',
        text: 'On the whole, I am satisfied with myself',
        type: 'likert',
        minLabel: 'Strongly disagree',
        maxLabel: 'Strongly agree',
      },
      {
        id: 'q2',
        text: 'At times I think I am no good at all',
        type: 'likert',
        minLabel: 'Strongly disagree',
        maxLabel: 'Strongly agree',
      },
      {
        id: 'q3',
        text: 'I feel that I have a number of good qualities',
        type: 'likert',
        minLabel: 'Strongly disagree',
        maxLabel: 'Strongly agree',
      },
      {
        id: 'q4',
        text: 'I am able to do things as well as most other people',
        type: 'likert',
        minLabel: 'Strongly disagree',
        maxLabel: 'Strongly agree',
      },
      {
        id: 'q5',
        text: 'I feel I do not have much to be proud of',
        type: 'likert',
        minLabel: 'Strongly disagree',
        maxLabel: 'Strongly agree',
      },
      {
        id: 'q6',
        text: 'I certainly feel useless at times',
        type: 'likert',
        minLabel: 'Strongly disagree',
        maxLabel: 'Strongly agree',
      },
      {
        id: 'q7',
        text: 'I feel that I am a person of worth, at least on an equal plane with others',
        type: 'likert',
        minLabel: 'Strongly disagree',
        maxLabel: 'Strongly agree',
      },
      {
        id: 'q8',
        text: 'I wish I could have more respect for myself',
        type: 'likert',
        minLabel: 'Strongly disagree',
        maxLabel: 'Strongly agree',
      },
    ],
    interpretationGuide: [
      {
        scoreRange: { min: 0, max: 15 },
        level: 'Low Self-Esteem',
        advice: 'You may benefit from self-compassion and working with a therapist to build self-esteem.',
      },
      {
        scoreRange: { min: 16, max: 20 },
        level: 'Average Self-Esteem',
        advice: 'Your self-esteem is within average range. Continue building positive self-perception.',
      },
      {
        scoreRange: { min: 21, max: 30 },
        level: 'High Self-Esteem',
        advice: 'You have healthy self-esteem. Continue maintaining positive self-image and confidence.',
      },
    ],
  },
  {
    id: 'moca',
    title: 'MoCA: Montreal Cognitive Assessment',
    description: 'Screen for mild cognitive impairment',
    category: 'Cognitive Function',
    questions: [
      {
        id: 'q1',
        text: 'What is the year?',
        type: 'yesNo',
      },
      {
        id: 'q2',
        text: 'What is the month?',
        type: 'yesNo',
      },
      {
        id: 'q3',
        text: 'What is the day?',
        type: 'yesNo',
      },
      {
        id: 'q4',
        text: 'Do you have difficulty remembering recent events?',
        type: 'likert',
        minLabel: 'No',
        maxLabel: 'Yes, very much',
      },
      {
        id: 'q5',
        text: 'Do you have difficulty concentrating or focusing?',
        type: 'likert',
        minLabel: 'No',
        maxLabel: 'Yes, very much',
      },
      {
        id: 'q6',
        text: 'Do you have difficulty with complex mental tasks?',
        type: 'likert',
        minLabel: 'No',
        maxLabel: 'Yes, very much',
      },
    ],
    interpretationGuide: [
      {
        scoreRange: { min: 0, max: 10 },
        level: 'Possible Cognitive Impairment',
        advice: 'Consider consulting a neurologist or cognitive specialist for comprehensive evaluation.',
      },
      {
        scoreRange: { min: 11, max: 18 },
        level: 'Mild Cognitive Concerns',
        advice: 'Monitor cognitive function and maintain mentally stimulating activities. Speak with your healthcare provider.',
      },
      {
        scoreRange: { min: 19, max: 30 },
        level: 'Normal Cognitive Function',
        advice: 'Your cognitive function appears normal. Continue with mentally stimulating activities and healthy lifestyle.',
      },
    ],
  },
];
