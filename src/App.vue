<script setup lang="ts">
import { computed } from 'vue'
import QuizHome from './components/QuizHome.vue'
import QuizPaper from './components/QuizPaper.vue'
import QuizResult from './components/QuizResult.vue'
import { useQuiz } from './composables/useQuiz'

const quiz = useQuiz()
const { quizResult, paper, resetAll } = quiz

const isDev = __DEV__

const currentView = computed(() => {
  if (quizResult.value) return 'result'
  if (paper.value) return 'paper'
  return 'home'
})

const handleRestart = () => {
  resetAll()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50" :class="{ 'select-none': !isDev }">
    <QuizHome v-if="currentView === 'home'" />
    <QuizPaper v-else-if="currentView === 'paper'" />
    <QuizResult v-else-if="currentView === 'result'" @restart="handleRestart" />
  </div>
</template>
