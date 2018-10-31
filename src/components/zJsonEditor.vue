<template>
  <z-monaco-editor class="z-markdown-editor" v-model="content" language="json"/>
</template>

<script>
import zMonacoEditor from "./zMonacoEditor";

export default {
  name: "zJsonEditor",
  components: {
    zMonacoEditor
  },
  props: ["value"],
  model: {
    prop: "value",
    event: "updateValue"
  },
  data() {
    return {
      content: ""
    };
  },
  created() {
    this.content = JSON.stringify(this.value, null, "\t");
  },
  watch: {
    content(val) {
      try {
        const parsed = JSON.parse(val);
        this.$emit("updateValue", parsed);
      } catch (e) {
        // Eat any error
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.z-markdown-editor
  height 500px
</style>
