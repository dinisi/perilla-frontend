<template>
  <v-chip label :outline="details[result].outline" :color="details[result].color" :text-color="details[result].textColor">
    {{ details[result].text }}
  </v-chip>
</template>

<script>
/* eslint-disable vue/no-shared-component-data */
import { SolutionResult } from '@/interfaces'

export default {
  name: 'solutionResult',
  props: ['result'],
  data () {
    return {
      details: [
        {
          outline: true,
          color: '#1abc9c',
          text: 'Waiting Judge'
        },
        {
          outline: true,
          color: '#f39c12',
          text: 'Judging'
        },
        {
          color: '#7f8c8d',
          text: 'Skipped',
          textColor: 'white'
        },
        {
          color: '#2ecc71',
          text: 'Accepted',
          textColor: 'white'
        },
        {
          color: '#e74c3c',
          text: 'Wrong Answer',
          textColor: 'white'
        },
        {
          color: '#9b59b6',
          text: 'Time Limit Exceeded',
          textColor: 'white'
        },
        {
          color: '#e67e22',
          text: 'Memory Limit Exceeded',
          textColor: 'white'
        },
        {
          color: '#f1c40f',
          text: 'Runtime Error',
          textColor: 'white'
        },
        {
          color: '#3498db',
          text: 'Compile Error',
          textColor: 'white'
        },
        {
          color: '#27ae60',
          text: 'Presentation Error',
          textColor: 'white'
        },
        {
          color: '#e74c3c',
          text: 'Judgement Failed',
          textColor: 'white'
        },
        {
          outline: true,
          color: '#c0392b',
          text: 'SystemError'
        },
        {
          outline: true,
          color: '#2c3e50',
          text: 'OtherError'
        }
      ]
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
