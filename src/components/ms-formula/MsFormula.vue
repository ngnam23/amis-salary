<script setup>
import { useField } from 'vee-validate'
import prism from 'prismjs'
import 'prismjs/components/prism-latex'
import { ref, watch, onMounted, onUnmounted } from 'vue'
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

function onFocus() {
  isFocused.value = true
}

function onBlur(e) {
  // preserve vee-validate blur handling
  handleBlur(e)
  // do not close popup here; global handlers manage closing when clicking/focusing outside
}

const containerRef = ref(null)

function onGlobalMouseDown(e) {
  if (!containerRef.value) return
  if (!containerRef.value.contains(e.target)) {
    isFocused.value = false
  }
}

function onGlobalFocusIn() {
  if (!containerRef.value) return
  if (!containerRef.value.contains(document.activeElement)) {
    isFocused.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onGlobalMouseDown)
  document.addEventListener('focusin', onGlobalFocusIn)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onGlobalMouseDown)
  document.removeEventListener('focusin', onGlobalFocusIn)
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
      @focus="onFocus"
      @blur="onBlur"
    />
    <pre class="prism-editor__editor" data-testid="preview" v-html="highlightedCode"></pre>
    <div v-if="isFocused" class="prism-editor__popup" data-testid="popup">
      <div class="p-4">
        <div class="flex items-center gap-x-6 mb-1 border-b border-[#e0e0e0]">
          <div
            :class="[
              'pb-1 border-b-[3px] cursor-pointer',
              tabActive === 1
                ? ' border-[#34b057] font-bold text-[#34b057]'
                : ' border-white font-normal',
            ]"
            @click="tabActive = 1"
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
            @click="tabActive = 2"
          >
            Tham số
          </div>
        </div>
        <div class="h-[171px] overflow-y-auto">
          <div
            v-for="func in formulaList"
            :key="func.name"
            class="flex items-center w-full px-2 hover:bg-[#eafbf2] hover:text-[#0E9A62] cursor-pointer"
          >
            <div class="w-5 h-5 flex items-center justify-center mr-3">
              <div class="icon-formula"></div>
            </div>
            <div class="flex items-center h-[57px] w-[calc(100%-36px)] border-b border-[#e0e0e0]">
              <span class="font-bold">{{ func.name }}</span>
              <span class="">{{ func.syntax }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  padding: 16px;
  z-index: 20;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.200000003);
  color: #101828;
  line-height: 18px;
  font-size: 13px;
}
</style>
