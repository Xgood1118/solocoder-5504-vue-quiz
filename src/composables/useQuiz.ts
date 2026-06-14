import { ref, reactive, computed, onMounted, onUnmounted, watch, getCurrentInstance } from 'vue'
import type { Question, Paper, ExtractMode, QuizResult, AntiCheatState, QuestionCategory, QuestionType } from '../types/quiz'
import { questionBank } from '../data/questions'

const TOTAL_QUESTIONS = 10
const TOTAL_DURATION_MS = 60 * 60 * 1000
const WARNING_THRESHOLD_MS = 5 * 60 * 1000
const DANGER_THRESHOLD_MS = 1 * 60 * 1000
const MAX_BLUR_COUNT = 3
const BLUR_PENALTY_MS = 30 * 1000
const STORAGE_KEY = 'vue-quiz-state'
const SERVER_TIME_KEY = 'vue-quiz-server-time'

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
  return (...args: Parameters<T>) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => fn(...args), delay)
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function groupByType(questions: Question[]) {
  const groups: Record<QuestionType, Question[]> = {
    single: [], multiple: [], judge: []
  }
  questions.forEach(q => groups[q.type].push(q))
  return groups
}

function determineTypeBudget(total: number): { judge: number; single: number; multiple: number } {
  let single = 6
  let multiple = 2
  let judge = Math.max(1, total - single - multiple)
  single = total - judge - multiple

  if (single < 5) { single = 5; multiple = total - judge - single }
  if (multiple < 2) { multiple = 2; single = total - judge - multiple }
  if (single > 7) { single = 7; multiple = total - judge - single }
  if (multiple > 3) { multiple = 3; single = total - judge - multiple }
  judge = total - single - multiple

  return { judge, single, multiple }
}

function extractEven(modeBudget: { judge: number; single: number; multiple: number }): Question[] {
  const allByType = groupByType(questionBank)
  const categories: QuestionCategory[] = ['frontend', 'backend', 'database', 'network', 'algorithm']
  const result: Question[] = []
  const usedIds = new Set<number>()

  const pickFromCategory = (type: QuestionType, category: QuestionCategory): Question | null => {
    const candidates = allByType[type].filter(q => q.category === category && !usedIds.has(q.id))
    if (candidates.length === 0) return null
    const picked = shuffleArray(candidates)[0]
    usedIds.add(picked.id)
    return picked
  }

  const pickFallback = (type: QuestionType): Question | null => {
    const candidates = allByType[type].filter(q => !usedIds.has(q.id))
    if (candidates.length === 0) return null
    const picked = shuffleArray(candidates)[0]
    usedIds.add(picked.id)
    return picked
  }

  const typeOrder: QuestionType[] = ['judge', 'single', 'multiple']
  let catIdx = 0

  for (const type of typeOrder) {
    let count = modeBudget[type]
    let attempts = 0
    while (count > 0 && attempts < 100) {
      const cat = categories[catIdx % categories.length]
      const picked = pickFromCategory(type, cat) ?? pickFallback(type)
      if (picked) { result.push(picked); count-- }
      catIdx++
      attempts++
    }
  }

  return result
}

function extractRandom(modeBudget: { judge: number; single: number; multiple: number }): Question[] {
  const allByType = groupByType(questionBank)
  const result: Question[] = []
  ;(['judge', 'single', 'multiple'] as QuestionType[]).forEach(type => {
    const shuffled = shuffleArray(allByType[type])
    result.push(...shuffled.slice(0, modeBudget[type]))
  })
  return shuffleArray(result)
}

function extractQuestions(mode: ExtractMode): Question[] {
  const budget = determineTypeBudget(TOTAL_QUESTIONS)
  const questions = mode === 'even' ? extractEven(budget) : extractRandom(budget)
  return shuffleArray(questions)
}

function calculateScore(paperObj: Paper): QuizResult {
  let obtainedScore = 0
  let correctCount = 0
  let wrongCount = 0
  let unansweredCount = 0
  const wrongQuestions: Question[] = []
  const totalScore = paperObj.questions.reduce((sum, q) => sum + q.score, 0)

  paperObj.questions.forEach((q, idx) => {
    const userAnswer = paperObj.answers[idx]
    if (userAnswer === null || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
      unansweredCount++
      wrongQuestions.push(q)
      return
    }
    if (q.type === 'multiple') {
      const userArr = Array.isArray(userAnswer) ? [...userAnswer].sort() : [userAnswer]
      const correctArr = Array.isArray(q.correctAnswer) ? [...q.correctAnswer].sort() : [q.correctAnswer]
      const isCorrect = userArr.length === correctArr.length && userArr.every((v, i) => v === correctArr[i])
      if (isCorrect) { obtainedScore += q.score; correctCount++ }
      else { wrongCount++; wrongQuestions.push(q) }
    } else {
      if (userAnswer === q.correctAnswer) { obtainedScore += q.score; correctCount++ }
      else { wrongCount++; wrongQuestions.push(q) }
    }
  })

  const beatPercentage = Math.floor(30 + Math.random() * 65)
  const timeUsed = Math.floor((paperObj.endTime - Date.now() > 0
    ? TOTAL_DURATION_MS - (paperObj.endTime - Date.now())
    : TOTAL_DURATION_MS) / 1000)

  return { totalScore, obtainedScore, correctCount, wrongCount, unansweredCount, wrongQuestions, beatPercentage, timeUsed }
}

// ====== Singleton state ======
const paper = ref<Paper | null>(null)
const quizResult = ref<QuizResult | null>(null)
const remainingSeconds = ref(0)
const isSubmitted = ref(false)
const antiCheat = reactive<AntiCheatState>({
  blurCount: 0,
  totalBlurTime: 0,
  lastBlurTime: null
})
let countdownTimer: ReturnType<typeof setInterval> | null = null

// ====== Computed ======
const remainingMs = computed(() => remainingSeconds.value * 1000)
const timerLevel = computed(() => {
  if (remainingMs.value <= DANGER_THRESHOLD_MS) return 'danger'
  if (remainingMs.value <= WARNING_THRESHOLD_MS) return 'warning'
  return 'normal'
})
const formattedTime = computed(() => {
  const total = Math.max(0, remainingSeconds.value)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})
const currentQuestion = computed(() => {
  if (!paper.value) return null
  return paper.value.questions[paper.value.currentIndex] ?? null
})
const currentAnswer = computed(() => {
  if (!paper.value) return null
  return paper.value.answers[paper.value.currentIndex] ?? null
})
const progress = computed(() => (paper.value ? paper.value.currentIndex + 1 : 0))
const answeredCount = computed(() => {
  if (!paper.value) return 0
  return paper.value.answers.filter(a => a !== null && !(Array.isArray(a) && a.length === 0)).length
})
const hasUnanswered = computed(() => {
  if (!paper.value) return false
  return paper.value.answers.some(a => a === null || (Array.isArray(a) && a.length === 0))
})

// ====== Persistence ======
const saveState = debounce(() => {
  if (!paper.value) return
  const state = { paper: paper.value, antiCheat: { ...antiCheat }, savedAt: Date.now() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  localStorage.setItem(SERVER_TIME_KEY, String(Date.now()))
}, 500)

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return false
  try {
    const state = JSON.parse(raw)
    if (!state.paper || state.paper.submitted) return false

    const remaining = state.paper.endTime - Date.now()

    if (remaining <= 0) {
      paper.value = state.paper
      if (paper.value) paper.value.endTime = Date.now()
      submitPaper()
      return false
    }

    paper.value = state.paper
    Object.assign(antiCheat, state.antiCheat)
    remainingSeconds.value = Math.floor(remaining / 1000)
    isSubmitted.value = false
    return true
  } catch {
    return false
  }
}

function clearState() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(SERVER_TIME_KEY)
}

// ====== Countdown ======
function startCountdown() {
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    if (!paper.value || paper.value.submitted) {
      stopCountdown()
      return
    }
    const remaining = paper.value.endTime - Date.now()
    remainingSeconds.value = Math.max(0, Math.floor(remaining / 1000))
    if (remaining <= 0) submitPaper()
  }, 1000)
}

function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

// ====== Actions ======
function startQuiz(mode: ExtractMode = 'even') {
  const questions = extractQuestions(mode)
  const now = Date.now()
  paper.value = {
    questions,
    startTime: now,
    endTime: now + TOTAL_DURATION_MS,
    currentIndex: 0,
    answers: new Array(questions.length).fill(null),
    submitted: false
  }
  quizResult.value = null
  isSubmitted.value = false
  antiCheat.blurCount = 0
  antiCheat.totalBlurTime = 0
  antiCheat.lastBlurTime = null
  remainingSeconds.value = Math.floor(TOTAL_DURATION_MS / 1000)
  startCountdown()
  saveState()
}

function setAnswer(answer: string | string[] | null) {
  if (!paper.value || paper.value.submitted) return
  paper.value.answers[paper.value.currentIndex] = answer
  saveState()
}

function toggleMultiOption(option: string) {
  if (!paper.value || paper.value.submitted) return
  const idx = paper.value.currentIndex
  const current = paper.value.answers[idx]
  const arr: string[] = Array.isArray(current) ? [...current] : []
  const pos = arr.indexOf(option)
  if (pos >= 0) arr.splice(pos, 1)
  else arr.push(option)
  paper.value.answers[idx] = arr.length > 0 ? arr : null
  saveState()
}

function goToQuestion(index: number) {
  if (!paper.value) return
  if (index < 0 || index >= paper.value.questions.length) return
  paper.value.currentIndex = index
  saveState()
}

function prevQuestion() {
  if (!paper.value) return
  goToQuestion(paper.value.currentIndex - 1)
}

function nextQuestion() {
  if (!paper.value) return
  goToQuestion(paper.value.currentIndex + 1)
}

function submitPaper() {
  if (!paper.value || paper.value.submitted) return
  paper.value.submitted = true
  isSubmitted.value = true
  stopCountdown()
  quizResult.value = calculateScore(paper.value)
  clearState()
}

function handleVisibilityChange() {
  if (__DEV__) return
  if (document.hidden) {
    antiCheat.lastBlurTime = Date.now()
  } else if (antiCheat.lastBlurTime) {
    const blurDuration = Date.now() - antiCheat.lastBlurTime
    antiCheat.totalBlurTime += blurDuration
    antiCheat.blurCount++
    antiCheat.lastBlurTime = null
    if (paper.value && !paper.value.submitted) {
      paper.value.endTime = Math.max(paper.value.startTime + 60 * 1000, paper.value.endTime - BLUR_PENALTY_MS)
      if (antiCheat.blurCount >= MAX_BLUR_COUNT) submitPaper()
      else saveState()
    }
  }
}

function handleBlur() {
  if (__DEV__) return
  antiCheat.lastBlurTime = Date.now()
}

function handleFocus() {
  if (__DEV__) return
  if (antiCheat.lastBlurTime) {
    const blurDuration = Date.now() - antiCheat.lastBlurTime
    antiCheat.totalBlurTime += blurDuration
    antiCheat.blurCount++
    antiCheat.lastBlurTime = null
    if (paper.value && !paper.value.submitted) {
      paper.value.endTime = Math.max(paper.value.startTime + 60 * 1000, paper.value.endTime - BLUR_PENALTY_MS)
      if (antiCheat.blurCount >= MAX_BLUR_COUNT) submitPaper()
      else saveState()
    }
  }
}

function practiceWrongQuestions() {
  if (!quizResult.value || quizResult.value.wrongQuestions.length === 0) return
  const wrongs = quizResult.value.wrongQuestions
  const now = Date.now()
  paper.value = {
    questions: wrongs,
    startTime: now,
    endTime: now + wrongs.length * 5 * 60 * 1000,
    currentIndex: 0,
    answers: new Array(wrongs.length).fill(null),
    submitted: false
  }
  quizResult.value = null
  isSubmitted.value = false
  antiCheat.blurCount = 0
  antiCheat.totalBlurTime = 0
  antiCheat.lastBlurTime = null
  remainingSeconds.value = Math.floor((wrongs.length * 5 * 60 * 1000) / 1000)
  startCountdown()
  saveState()
}

function resetAll() {
  stopCountdown()
  paper.value = null
  quizResult.value = null
  isSubmitted.value = false
  remainingSeconds.value = 0
  antiCheat.blurCount = 0
  antiCheat.totalBlurTime = 0
  antiCheat.lastBlurTime = null
  clearState()
}

// ====== Lifecycle registration (once) ======
let lifecycleBound = false

function setupLifecycle() {
  if (lifecycleBound) return
  lifecycleBound = true

  onMounted(() => {
    const resumed = loadState()
    if (resumed) startCountdown()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
  })

  onUnmounted(() => {
    stopCountdown()
    if (debounceTimer) clearTimeout(debounceTimer)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('blur', handleBlur)
    window.removeEventListener('focus', handleFocus)
  })

  watch(
    () => (paper.value ? [paper.value.currentIndex, paper.value.answers.join('|')] : null),
    () => paper.value && saveState()
  )
}

export function useQuiz() {
  const instance = getCurrentInstance()
  if (instance) setupLifecycle()

  return {
    paper,
    quizResult,
    remainingSeconds,
    remainingMs,
    timerLevel,
    formattedTime,
    currentQuestion,
    currentAnswer,
    progress,
    answeredCount,
    hasUnanswered,
    isSubmitted,
    antiCheat,
    startQuiz,
    setAnswer,
    toggleMultiOption,
    goToQuestion,
    prevQuestion,
    nextQuestion,
    submitPaper,
    practiceWrongQuestions,
    resetAll
  }
}
