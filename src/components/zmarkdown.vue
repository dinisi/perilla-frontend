<template>
  <article :class="'markdown-body-' + theme" v-html="content" />
</template>

<script>
export default {
  name: 'zMarkdown',
  props: ['content'],
  computed: {
    theme () {
      return this.$store.state.darkTheme ? 'dark' : 'light'
    }
  }
}
</script>
