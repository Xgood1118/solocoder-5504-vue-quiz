<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuiz } from '../composables/useQuiz'
import type { Question } from '../types/quiz'

const quiz = useQuiz()
const showConfirmModal = ref(false)
const pendingSubmit = ref(false)
const isDev = __DEV__

const {
  paper,
  formattedTime,
  timerLevel,
  currentQuestion,
  progress,
  answeredCount,
  antiCheat,
  goToQuestion,
  prevQuestion,
  nextQuestion
} = quiz

const typeLabelMap: Record<Question['type'], string> = {
  single: '单选题',
  multiple: '多选题',
  judge: '判断题'
}

const typeColorMap: Record<Question['type'], string> = {
  single: 'bg-blue-100 text-blue-700',
  multiple: 'bg-purple-100 text-purple-700',
  judge: 'bg-green-100 text-green-700'
}

const categoryLabelMap: Record<Question['category'], string> = {
  frontend: '前端',
  backend: '后端',
  database: '数据库',
  network: '网络',
  algorithm: '算法'
}

const isOptionSelected = (opt: string) => {
  const ans = quiz.currentAnswer.value
  if (ans === null) return false
  if (Array.isArray(ans)) return ans.includes(opt)
  return ans === opt
}

const handleOptionClick = (opt: string) => {
  const q = quiz.currentQuestion.value
  if (!q) return
  if (q.type === 'multiple') {
    quiz.toggleMultiOption(opt)
  } else {
    quiz.setAnswer(opt)
  }
}

const requestSubmit = () => {
  if (quiz.hasUnanswered.value) {
    showConfirmModal.value = true
  } else {
    doSubmit()
  }
}

const doSubmit = () => {
  pendingSubmit.value = true
  setTimeout(() => {
    quiz.submitPaper()
    showConfirmModal.value = false
    pendingSubmit.value = false
  }, 300)
}

const questionAnswered = (idx: number) => {
  if (!quiz.paper.value) return false
  const a = quiz.paper.value.answers[idx]
  return a !== null && !(Array.isArray(a) && a.length === 0)
}

const totalQuestions = computed(() => quiz.paper.value?.questions.length ?? 0)
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-28">
    <div class="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-gray-700">
            第 <span class="text-primary font-bold">{{ progress }}</span> / {{ totalQuestions }} 题
          </span>
          <span class="text-sm text-gray-400">|</span>
          <span class="text-sm text-gray-500">已答 {{ answeredCount }}</span>
        </div>

        <div class="flex items-center gap-3">
          <div
            v-if="!isDev && antiCheat.blurCount > 0"
            class="px-2 py-1 rounded-lg text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200"
          >
            切屏 {{ antiCheat.blurCount }}/3
          </div>
          <div
            :class="[
              'px-4 py-2 rounded-xl font-mono text-lg font-bold tabular-nums transition-all',
              timerLevel === 'danger'
                ? 'bg-danger text-white animate-pulse shadow-lg shadow-danger/30'
                : timerLevel === 'warning'
                ? 'bg-warning text-white shadow shadow-warning/20'
                : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ formattedTime }}
          </div>
        </div>
      </div>
      <div class="max-w-3xl mx-auto px-4 pb-3">
        <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-300 rounded-full"
            :style="{ width: `${(answeredCount / totalQuestions) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-4 py-6">
      <div v-if="currentQuestion" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div class="flex items-center gap-2 mb-4 flex-wrap">
          <span :class="['px-3 py-1 rounded-lg text-xs font-semibold', typeColorMap[currentQuestion.type]]">
            {{ typeLabelMap[currentQuestion.type] }}
          </span>
          <span class="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
            {{ categoryLabelMap[currentQuestion.category] }}
          </span>
          <span class="ml-auto text-sm font-semibold text-gray-500">
            {{ currentQuestion.score }} 分
          </span>
        </div>

        <h2 class="text-lg font-semibold text-gray-900 leading-relaxed mb-6">
          {{ currentQuestion.stem }}
        </h2>

        <div class="space-y-3">
          <button
            v-for="(opt, idx) in currentQuestion.options"
            :key="idx"
            @click="handleOptionClick(opt)"
            :class="[
              'w-full text-left p-4 rounded-xl border-2 transition-all group',
              isOptionSelected(opt)
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
            ]"
          >
            <div class="flex items-start gap-3">
              <div
                :class="[
                  'flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all',
                  currentQuestion.type === 'multiple' ? 'rounded-md' : '',
                  isOptionSelected(opt)
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 text-gray-400 group-hover:border-gray-400'
                ]"
              >
                <span v-if="currentQuestion.type === 'multiple' && isOptionSelected(opt)">✓</span>
                <span v-else-if="currentQuestion.type !== 'multiple'">{{ ['A', 'B', 'C', 'D', 'E', 'F'][idx] }}</span>
                <span v-else>{{ ['A', 'B', 'C', 'D', 'E', 'F'][idx] }}</span>
              </div>
              <span
                :class="['flex-1 text-base leading-relaxed pt-0.5',
                  isOptionSelected(opt) ? 'text-gray-900 font-medium' : 'text-gray-700'
                ]"
              >
                {{ opt }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <div v-if="paper" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div class="text-sm font-semibold text-gray-700 mb-3">答题卡</div>
        <div class="grid grid-cols-5 sm:grid-cols-10 gap-2">
          <button
            v-for="(_, idx) in paper.questions"
            :key="idx"
            @click="goToQuestion(idx)"
            :class="[
              'aspect-square rounded-lg text-sm font-semibold transition-all',
              paper.currentIndex === idx
                ? 'bg-primary text-white shadow shadow-primary/30'
                : questionAnswered(idx)
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            ]"
          >
            {{ idx + 1 }}
          </button>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div class="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <button
          @click="prevQuestion"
          :disabled="paper?.currentIndex === 0"
          class="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          上一题
        </button>
        <button
          v-if="(paper?.currentIndex ?? -1) < (totalQuestions - 1)"
          @click="nextQuestion"
          class="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all bg-primary text-white hover:bg-blue-600 shadow-sm"
        >
          下一题
        </button>
        <button
          v-else
          @click="requestSubmit"
          class="px-6 py-2.5 rounded-xl font-bold text-sm transition-all bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40"
        >
          提交试卷
        </button>
        <div class="ml-auto text-xs text-gray-400 hidden sm:block">
          进度 {{ progress }} / {{ totalQuestions }}
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="showConfirmModal = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">确认提交？</h3>
              </div>
            </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">
              你还有 <span class="font-bold text-danger">{{ totalQuestions - answeredCount }}</span> 道题目未作答，确定要提交吗？</p>
            <div class="flex items-center gap-3 justify-end mt-6">
              <button
                @click="showConfirmModal = false"
                class="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
              >
                继续答题
              </button>
              <button
                @click="doSubmit"
                :disabled="pendingSubmit"
                class="px-5 py-2.5 rounded-xl font-semibold text-sm bg-danger text-white hover:bg-red-600 transition-all disabled:opacity-60 flex items-center gap-2"
              >
                <svg v-if="pendingSubmit" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                确认提交
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
