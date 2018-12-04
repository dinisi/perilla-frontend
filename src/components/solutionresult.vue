<template>
  <v-chip label :outline="details[result].outline" :color="details[result].color" :text-color="details[result].textColor">
    {{ $t(details[result].text) }}
  </v-chip>
</template>

<script>
import { SolutionResult, resultDisplay } from '@/interfaces'

export default {
  name: 'solutionResult',
  props: ['result'],
  data () {
    return {
      details: resultDisplay
    }
  }
}
</script>
