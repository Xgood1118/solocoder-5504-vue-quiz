<script setup lang="ts">
import { ref } from 'vue'
import { useQuiz } from '../composables/useQuiz'
import type { ExtractMode } from '../types/quiz'

const quiz = useQuiz()
const mode = ref<ExtractMode>('even')

const handleStart = () => {
  quiz.startQuiz(mode.value)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div class="w-full max-w-lg">
      <div class="text-center mb-10">
        <div class="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/20">
          <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">在线答题活动</h1>
        <p class="text-gray-500">共 10 道题 · 限时 60 分钟 · 断网可续答</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 mb-6">
        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-700 mb-3">抽题模式</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="mode = 'even'"
              :class="[
                'p-4 rounded-xl border-2 transition-all text-left',
                mode === 'even'
                  ? 'border-primary bg-blue-50 ring-2 ring-primary/10'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              ]"
            >
              <div class="flex items-center gap-2 mb-1">
                <div :class="['w-4 h-4 rounded-full border-2 flex items-center justify-center',
                  mode === 'even' ? 'border-primary' : 'border-gray-300'
                ]">
                  <div v-if="mode === 'even'" class="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span class="font-semibold" :class="mode === 'even' ? 'text-primary' : 'text-gray-700'">按分类均匀</span>
              </div>
              <p class="text-xs text-gray-500 ml-6">各类别题目均衡分布，推荐使用</p>
            </button>

            <button
              @click="mode = 'random'"
              :class="[
                'p-4 rounded-xl border-2 transition-all text-left',
                mode === 'random'
                  ? 'border-primary bg-blue-50 ring-2 ring-primary/10'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              ]"
            >
              <div class="flex items-center gap-2 mb-1">
                <div :class="['w-4 h-4 rounded-full border-2 flex items-center justify-center',
                  mode === 'random' ? 'border-primary' : 'border-gray-300'
                ]">
                  <div v-if="mode === 'random'" class="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span class="font-semibold" :class="mode === 'random' ? 'text-primary' : 'text-gray-700'">完全随机</span>
              </div>
              <p class="text-xs text-gray-500 ml-6">从题库中随机抽取题目</p>
            </button>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-2">
          <div class="flex items-start gap-2">
            <span class="text-primary mt-0.5">●</span>
            <span>判断题 ≥ 1 道 · 单选题 5-7 道 · 多选题 2-3 道</span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-warning mt-0.5">●</span>
            <span>剩余 5 分钟橙色提醒，剩余 1 分钟红色闪烁</span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-danger mt-0.5">●</span>
            <span>切屏累计 3 次自动交卷，请勿离开答题页面</span>
          </div>
        </div>
      </div>

      <button
        @click="handleStart"
        class="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:from-blue-600 hover:to-indigo-700 active:scale-[0.98] transition-all"
      >
        开始答题
      </button>
    </div>
  </div>
</template>
