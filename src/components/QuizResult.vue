<script setup lang="ts">
import { computed } from 'vue'
import { useQuiz } from '../composables/useQuiz'
import type { Question } from '../types/quiz'

defineEmits(['restart'])

const quiz = useQuiz()
const { quizResult, paper, practiceWrongQuestions } = quiz

const percentage = computed(() => {
  if (!quizResult.value) return 0
  if (quizResult.value.totalScore === 0) return 0
  return Math.round((quizResult.value.obtainedScore / quizResult.value.totalScore) * 100)
})

const ringColor = computed(() => {
  if (percentage.value >= 80) return '#22c55e'
  if (percentage.value >= 60) return '#f59e0b'
  return '#ef4444'
})

const ringBgColor = computed(() => {
  if (percentage.value >= 80) return '#dcfce7'
  if (percentage.value >= 60) return '#fef3c7'
  return '#fee2e2'
})

const resultTitle = computed(() => {
  if (percentage.value >= 90) return '优秀！'
  if (percentage.value >= 80) return '表现不错'
  if (percentage.value >= 60) return '及格通过'
  return '继续努力'
})

const resultDesc = computed(() => {
  if (percentage.value >= 90) return '你的知识掌握得非常扎实，继续保持！'
  if (percentage.value >= 80) return '整体表现良好，个别知识点再加强一下。'
  if (percentage.value >= 60) return '基础还可以，但有提升空间哦。'
  return '不要灰心，多练习几道错题再来挑战吧！'
})

const ringRadius = 72
const circumference = 2 * Math.PI * ringRadius
const dashOffset = computed(() => circumference - (percentage.value / 100) * circumference)

const formatTimeUsed = (sec: number) => {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}小时${m}分${s}秒`
  if (m > 0) return `${m}分${s}秒`
  return `${s}秒`
}

const categoryLabelMap: Record<Question['category'], string> = {
  frontend: '前端',
  backend: '后端',
  database: '数据库',
  network: '网络',
  algorithm: '算法'
}

const userAnswerText = (qid: number) => {
  if (!paper.value) return '—'
  const idx = paper.value.questions.findIndex((qq: Question) => qq.id === qid)
  if (idx < 0) return '—'
  const ans = paper.value.answers[idx]
  if (ans === null || (Array.isArray(ans) && ans.length === 0)) return '未作答'
  if (Array.isArray(ans)) return ans.join('、')
  return ans
}

const correctAnswerText = (q: Question) => {
  if (Array.isArray(q.correctAnswer)) return q.correctAnswer.join('、')
  return q.correctAnswer
}

const isUserOptionSelected = (q: Question, opt: string) => {
  const ua = userAnswerText(q.id)
  if (ua === '未作答' || ua === '—') return false
  if (q.type === 'multiple') {
    return ua.split('、').includes(opt)
  }
  return ua === opt
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <div v-if="quizResult" class="mb-6">
        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="relative flex-shrink-0">
              <svg :width="180" :height="180" class="transform -rotate-90">
                <circle
                  cx="90"
                  cy="90"
                  :r="ringRadius"
                  fill="none"
                  :stroke="ringBgColor"
                  stroke-width="16"
                />
                <circle
                  cx="90"
                  cy="90"
                  :r="ringRadius"
                  fill="none"
                  :stroke="ringColor"
                  stroke-width="16"
                  stroke-linecap="round"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="dashOffset"
                  style="transition: stroke-dashoffset 1s ease-out"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="text-4xl font-bold" :style="{ color: ringColor }">{{ percentage }}%</div>
                <div class="text-sm text-gray-500 mt-1">正确率</div>
              </div>
            </div>

            <div class="flex-1 text-center md:text-left">
              <div class="mb-3">
                <span
                  :class="[
                    'inline-block px-4 py-1.5 rounded-full text-sm font-semibold',
                    percentage >= 80 ? 'bg-green-100 text-green-700' :
                    percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  ]"
                >
                  {{ resultTitle }}
                </span>
              </div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">
                {{ quizResult.obtainedScore }} <span class="text-lg text-gray-400 font-normal">/ {{ quizResult.totalScore }} 分</span>
              </h1>
              <p class="text-gray-500 mb-4">{{ resultDesc }}</p>
              <div class="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl">
                <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span class="text-indigo-700 font-semibold text-sm">
                  击败了全国 <span class="text-lg font-bold">{{ quizResult.beatPercentage }}%</span> 的考生
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div class="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div class="text-2xl font-bold text-green-600">{{ quizResult.correctCount }}</div>
            <div class="text-xs text-gray-500 mt-1">答对</div>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div class="text-2xl font-bold text-red-500">{{ quizResult.wrongCount }}</div>
            <div class="text-xs text-gray-500 mt-1">答错</div>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div class="text-2xl font-bold text-gray-400">{{ quizResult.unansweredCount }}</div>
            <div class="text-xs text-gray-500 mt-1">未答</div>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div class="text-2xl font-bold text-indigo-500">{{ formatTimeUsed(quizResult.timeUsed) }}</div>
            <div class="text-xs text-gray-500 mt-1">用时</div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <button
            v-if="quizResult.wrongQuestions.length > 0"
            @click="practiceWrongQuestions"
            class="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all active:scale-[0.98]"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              错题再练（{{ quizResult.wrongQuestions.length }} 道）
            </span>
          </button>
          <button
            @click="$emit('restart')"
            class="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-primary text-white hover:bg-blue-600 shadow-sm transition-all active:scale-[0.98]"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              再测一次
            </span>
          </button>
        </div>

        <div v-if="quizResult.wrongQuestions.length > 0 && paper" class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 class="font-bold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              错题回顾（共 {{ quizResult.wrongQuestions.length }} 题）
            </h2>
          </div>

          <div class="divide-y divide-gray-100">
            <div
              v-for="(q, i) in quizResult.wrongQuestions"
              :key="q.id"
              class="p-6"
            >
              <div class="flex items-center gap-2 mb-3 flex-wrap">
                <span class="text-sm font-bold text-gray-400">#{{ i + 1 }}</span>
                <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                  {{ categoryLabelMap[q.category] }} · {{ q.score }}分
                </span>
              </div>
              <p class="text-gray-900 font-semibold leading-relaxed mb-4">{{ q.stem }}</p>

              <div class="space-y-2 mb-4">
                <div
                  v-for="(opt, optIdx) in q.options"
                  :key="optIdx"
                  :class="[
                    'p-3 rounded-xl border text-sm',
                    (Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(opt) : q.correctAnswer === opt)
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : isUserOptionSelected(q, opt)
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                  ]"
                >
                  <span class="font-semibold mr-2">{{ ['A', 'B', 'C', 'D', 'E', 'F'][optIdx] }}.</span>
                  {{ opt }}
                  <span
                    v-if="Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(opt) : q.correctAnswer === opt"
                    class="ml-2 text-green-600 font-semibold text-xs"
                  >✓ 正确答案</span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div class="p-3 rounded-xl bg-red-50 border border-red-100">
                  <div class="text-xs font-semibold text-red-600 mb-1">你的答案</div>
                  <div class="text-sm text-red-800 font-medium">
                    {{ userAnswerText(q.id) }}
                  </div>
                </div>
                <div class="p-3 rounded-xl bg-green-50 border border-green-100">
                  <div class="text-xs font-semibold text-green-600 mb-1">正确答案</div>
                  <div class="text-sm text-green-800 font-medium">
                    {{ correctAnswerText(q) }}
                  </div>
                </div>
              </div>

              <div class="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div class="text-xs font-semibold text-blue-600 mb-1">解析</div>
                    <div class="text-sm text-blue-900 leading-relaxed">{{ q.analysis }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
