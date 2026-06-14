export type QuestionType = 'single' | 'multiple' | 'judge'

export type QuestionCategory = 
  | 'frontend' 
  | 'backend' 
  | 'database' 
  | 'network' 
  | 'algorithm'

export interface Question {
  id: number
  type: QuestionType
  category: QuestionCategory
  stem: string
  options: string[]
  correctAnswer: string | string[]
  score: number
  analysis: string
}

export interface Paper {
  questions: Question[]
  startTime: number
  endTime: number
  currentIndex: number
  answers: (string | string[] | null)[]
  submitted: boolean
}

export type ExtractMode = 'even' | 'random'

export interface QuizResult {
  totalScore: number
  obtainedScore: number
  correctCount: number
  wrongCount: number
  unansweredCount: number
  wrongQuestions: Question[]
  beatPercentage: number
  timeUsed: number
}

export interface AntiCheatState {
  blurCount: number
  totalBlurTime: number
  lastBlurTime: number | null
}
