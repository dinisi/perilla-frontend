<template>
  <div/>
</template>

<script>
export default {
  name: 'blank',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$router.replace(from.fullPath)
    })
  }
}
</script>
