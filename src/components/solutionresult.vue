<template>
  <v-chip label :outline="details[result].outline" :color="details[result].color" :text-color="details[result].textColor">
    {{ details[result].text }}
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

<style scoped>
.result-0{
  color: #7f8c8d;
}
.result-1{
  color: #34495e;
}
.result-2{
  color: #c0392b;
  font-weight:bold;
}
.result-3{
  color: #2ecc71;
  font-weight:bold;
}
.result-4{
  color: #e74c3c;
  font-weight:bold;
}
.result-5{
  color: #8e44ad;
  font-weight:bold;
}
.result-6{
  color: #8e44ad;
  font-weight:bold;
}
.result-7{
  color: #f1c40f;
  font-weight:bold;
}
.result-8{
  color: #2980b9;
  font-weight:bold;
}
.result-9{
  color: #1abc9c;
  font-weight:bold;
}
.result-10{
  color: #c0392b;
  font-weight:bold;
}
.result-11{
  color: #f39c12;
  font-weight:bold;
}
.result-12{
  color: #34495e;
  font-weight:bold;
}
</style>
