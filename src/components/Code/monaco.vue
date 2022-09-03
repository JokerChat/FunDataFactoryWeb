<template>
  <monaco-editor
    ref="moncaco"
    :height="height"
    :width="width"
    :language="lang"
    :theme="theme"
    :code="text"
    :options="options"
    @codeChange="onCodeChange"
  />
</template>

<script>
import MonacoEditor from 'vue-monaco-editor-zh'

export default {
  name: 'EditMonaco',
  components: {
    MonacoEditor
  },
  model: {
    prop: 'code', // 指向props的参数名
    event: 'codeUpdate' // 事件名称
  },
  props: {
    readonly: {
      default: false,
      type: Boolean
    },
    code: {
      default: '',
      type: String
    },
    lang: {
      default: 'json',
      type: String
    },
    width: {
      default: '100%',
      type: [String, Number]
    },
    height: {
      default: '400px',
      type: [String, Number]
    }
  },
  data() {
    return {
      theme: 'vs',
      options: {
        wordWrap: 'on',
        // wordWrap: 'wordWrapColumn',
        // wordWrapColumn: 80,
        detectIndentation: true,
        insertSpaces: true,
        tabSize: 4,
        autoIndent: true,
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: this.readonly,
        automaticLayout: true,
        glyphMargin: true,
        showFoldingControls: 'always',
        formatOnPaste: true,
        formatOnType: true,
        scrollBeyondLastLine: false, // 是否允许滚动到最后一行
        minimap: {
          enabled: false
        },
        json: {
          format: {
            enable: true
          }
        },
        folding: true
      }
    }
  },
  computed: {
    text: {
      get: function() {
        return this.code
      },
      set: function(val) {
        val = val.replaceAll('	', '    ')
        this.$emit('codeUpdate', val)
      }
    }
  },
  watch: {
    readonly(val) {
      this.$refs.moncaco.editor.updateOptions({ readOnly: val })
    }
  },
  methods: {
    onCodeChange(editor) {
      var val = editor.getValue()
      this.text = val
    },
    formatDocument() {
      this.$refs.moncaco.editor.getAction(['editor.action.formatDocument'])._run()
    },
    layout(code) {
      if (this.$refs.moncaco.editor) {
        this.$refs.moncaco.editor.layout()
        if (code) {
          this.$refs.moncaco.editor.setValue(code)
        } else {
          this.$refs.moncaco.editor.setValue(this.code)
        }
      }
    }
  }
}
</script>
<style>
</style>
