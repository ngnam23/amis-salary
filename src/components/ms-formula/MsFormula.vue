<script setup>
import { useField } from 'vee-validate'
import prism from 'prismjs'
import 'prismjs/components/prism-latex'
import { ref, watch, onMounted, onUnmounted, nextTick, KeepAlive } from 'vue'
import http from '@/utils/http'
import { listApi } from '@/constants/list-api'
import 'prismjs/themes/prism-tomorrow.css'
import { excelFormulaGrammar, formulaList } from '@/constants/common'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
})

const { value, handleBlur, setValue } = useField(() => props.name)
const highlightedCode = ref('')
const isFocused = ref(false)
const tabActive = ref(1)

const pageIndex = ref(1)
const pageSize = ref(20)
const options = ref([])
const isLoading = ref(false)
const hasMore = ref(true)

const getData = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const response = await http.post(listApi.SalaryCompositionsPaging, {
      pageSize: pageSize.value,
      pageIndex: pageIndex.value,
    })
    if (response.isSuccess) {
      if (pageIndex.value === 1) {
        options.value = response.data.data
      } else {
        options.value.push(...response.data.data)
      }

      if (response.data.data.length < pageSize.value) {
        hasMore.value = false
      } else {
        hasMore.value = true
      }
    }
  } catch (error) {
    console.error('Error fetching list:', error)
  } finally {
    isLoading.value = false
  }
}

const handleScroll = (event) => {
  const { scrollTop, clientHeight, scrollHeight } = event.target
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadMore()
  }
}

const loadMore = async () => {
  if (isLoading.value || !hasMore.value) return
  pageIndex.value++
  await getData()
}

async function handleScrollMore() {
  await nextTick()
  const popup = containerRef.value?.querySelector('.prism-editor__popup')
  if (!popup) return
  const scrollContainer = popup.querySelector('.ms-popup-scroll')
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll)
  }
}

function removeScrollMoreListen() {
  const popup = containerRef.value?.querySelector('.prism-editor__popup')
  if (!popup) return
  const scrollContainer = popup.querySelector('.ms-popup-scroll')
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', handleScroll)
  }
}

const containerRef = ref(null)

function handleMouseDown(e) {
  if (!containerRef.value) return
  if (!containerRef.value.contains(e.target)) {
    isFocused.value = false
  }
}

function handleFocusIn() {
  if (!containerRef.value) return
  if (!containerRef.value.contains(document.activeElement)) {
    isFocused.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('focusin', handleFocusIn)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('focusin', handleFocusIn)
  removeScrollMoreListen()
})

watch(
  value,
  (newValue) => {
    if (newValue === null || newValue === undefined) {
      highlightedCode.value = ''
      return
    }
    highlightedCode.value = prism.highlight(newValue, excelFormulaGrammar, 'excel')
  },
  { immediate: true },
)

const changeTab = async (tab) => {
  tabActive.value = tab
  if (tab === 2) {
    pageIndex.value = 1
    hasMore.value = true
    getData()
    await handleScrollMore()
  } else {
    removeScrollMoreListen()
  }
}

const handleChooseFormule = (text) => {
  if (!text.trim()) return
  const newValue = (value.value || '') + text
  setValue(newValue)
}
</script>

<template>
  <div ref="containerRef" class="prism-editor__container">
    <textarea
      :value="value"
      class="prism-editor__textarea !rounded-[8px]"
      spellcheck="false"
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      data-gramm="false"
      data-testid="textarea"
      :placeholder="placeholder"
      @input="($event) => setValue($event.target.value)"
      @focus="isFocused = true"
      @blur="handleBlur"
    />
    <pre class="prism-editor__editor" data-testid="preview" v-html="highlightedCode"></pre>
    <KeepAlive v-if="isFocused" class="prism-editor__popup" data-testid="popup">
      <div>
        <div class="flex items-center gap-x-6 mb-1 border-b border-[#e0e0e0]">
          <div
            :class="[
              'pb-1 border-b-[3px] cursor-pointer',
              tabActive === 1
                ? ' border-[#34b057] font-bold text-[#34b057]'
                : ' border-white font-normal',
            ]"
            @click="changeTab(1)"
          >
            Công thức
          </div>
          <div
            :class="[
              'pb-1 border-b-[3px] cursor-pointer',
              tabActive === 2
                ? ' border-[#34b057] font-bold text-[#34b057]'
                : ' border-white font-normal',
            ]"
            @click="changeTab(2)"
          >
            Tham số
          </div>
        </div>
        <div v-if="tabActive === 1" class="h-[171px] overflow-y-auto">
          <div
            v-for="func in formulaList"
            :key="func.name"
            class="flex items-center w-full px-2 hover:bg-[#eafbf2] hover:text-[#0E9A62] cursor-pointer"
            @click="() => handleChooseFormule(func.name)"
          >
            <div class="w-5 h-5 flex items-center justify-center mr-3">
              <div class="icon-formula"></div>
            </div>
            <div class="flex items-center h-[57px] w-[calc(100%-36px)] border-b border-[#e0e0e0]">
              <span class="font-bold">{{ func.name }}</span>
              <span class="font-normal">{{ func.syntax }}</span>
            </div>
          </div>
        </div>
        <div v-if="tabActive === 2" class="h-[171px] overflow-y-auto ms-popup-scroll">
          <div class="flex flex-col">
            <div
              v-for="opt in options"
              :key="opt.salaryCompositionId"
              class="flex items-center w-full px-2 hover:bg-[#eafbf2] hover:text-[#0E9A62] cursor-pointer"
              @click="() => handleChooseFormule(opt.salaryCompositionCode)"
            >
              <div class="w-5 h-5 flex items-center justify-center mr-3">
                <div class="icon-database"></div>
              </div>
              <div class="flex items-center h-[57px] w-[calc(100%-36px)] border-b border-[#e0e0e0]">
                <span class="font-bold">{{ opt.salaryCompositionName }}</span>
                <span class="font-normal">({{ opt.salaryCompositionCode }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </KeepAlive>
  </div>
</template>

<style>
.token.punctuation,
.token.operator {
  color: red !important;
}

.token.function-name,
.token.number,
.token.string {
  color: #000 !important;
}

.token.cell-selector {
  color: #1570ef;
}
.prism-editor__container {
  min-height: 70px;
  width: 100% !important;
  border: 1px solid #e0e0e0;
  padding: 8px 12px !important;
  background: #fff;
  min-height: 28px;
  align-items: center;
  line-height: 18px;
  position: relative;
  text-align: left;
  overflow: visible;
  border-radius: 8px;
}
.prism-editor__container:hover,
.prism-editor__container:focus-within {
  border-color: #0e9a62;
}

.prism-editor__textarea {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  padding: 8px 12px !important;
  border: none;
  outline: none;
  width: 100%;
  margin: 0;
  background: none;
  color: #007aff;
  -webkit-font-smoothing: antialiased;
  -webkit-text-fill-color: transparent;
  overflow: hidden;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  white-space: pre-wrap;
  letter-spacing: 0.13px;
  overflow-wrap: break-word;
  text-rendering: optimizeSpeed;
  font-weight: 400;
}
.prism-editor__editor {
  color: #1570ef;
  line-height: 18px;
  margin: 0;
  border: none;
  background: none;
  padding: 0;
  min-height: 70px !important;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  white-space: pre-wrap;
  letter-spacing: 0.13px;
  overflow-wrap: break-word;
  text-rendering: optimizeSpeed;
  font-weight: 400;
}
.prism-editor__popup {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 32px;
  z-index: 20;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.200000003);
  color: #101828;
  line-height: 18px;
  font-size: 13px;
}
</style>
