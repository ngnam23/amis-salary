<script setup>
import { useField } from 'vee-validate'
import prism from 'prismjs'
import 'prismjs/components/prism-latex'
import { ref, watch } from 'vue'
import 'prismjs/themes/prism-tomorrow.css'
import { excelFormulaGrammar } from '@/constants/common'

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
  <div class="prism-editor__container">
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
      @blur="handleBlur"
    />
    <pre class="prism-editor__editor" data-testid="preview" v-html="highlightedCode"></pre>
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
  overflow: hidden;
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
</style>
