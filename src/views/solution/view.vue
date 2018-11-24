<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex>
        <v-card>
          <v-card-title>
            <div>
              <div class="headline" v-text="solution.id" />
              <div class="subheading">{{ solution.creator }}</div>
            </div>
          </v-card-title>
          <v-card-text>
            <v-data-table class="fullwidth" :headers="headers" :items="solutions" :loading="loading">
              <template slot="items" slot-scope="props">
                <tr>
                  <td>{{ props.item.id }}</td>
                  <td class="text-xs-right">{{ props.item.problem }}</td>
                  <td class="text-xs-right">{{ SolutionResult[props.item.status] }}</td>
                  <td class="text-xs-right">{{ props.item.score }}</td>
                  <td class="text-xs-right">{{ props.item.created }}</td>
                  <td class="text-xs-right">{{ props.item.creator }}</td>
                </tr>
              </template>
            </v-data-table>
            <b>{{ $t("details") }}:</b><br >
            <z-json-editor v-model="solution.details" :readonly="true" />
            <b>{{ $t("data") }}:</b><br >
            <z-json-editor v-model="solution.data" :readonly="true" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-text="$t('remove')" @click="remove" />
            <v-btn color="primary" v-text="$t('rejudge')" @click="rejudge" />
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from '@/http'
import render from '@/helper/markdown'
import { SolutionResult } from '@/interfaces'
import zJsonEditor from '@/components/zjsoneditor.vue'

export default {
  name: 'SolutionView',
  props: ['id'],
  components: {
    zJsonEditor
  },
  data () {
    return {
      headers: [
        { text: this.$t('ID'), align: 'left', sortable: true, value: 'id' },
        { text: this.$t('problem'), value: 'problem', class: 'text-xs-right' },
        { text: this.$t('status'), value: 'status', class: 'text-xs-right' },
        { text: this.$t('score'), value: 'score', class: 'text-xs-right' },
        { text: this.$t('created'), value: 'created', class: 'text-xs-right' },
        { text: this.$t('creator'), value: 'creator', class: 'text-xs-right' }
      ],
      solution: {
        id: null,
        problem: null,
        status: 0,
        score: 0,
        data: {},
        details: {},
        created: null,
        owner: null,
        creator: null
      },
      solutions: [],
      loading: true,
      intervalID: null,
      SolutionResult
    }
  },
  mounted () {
    this.fetch()
    this.intervalID = setInterval(this.fetch, 5000)
    this.solutions = [this.solution]
  },
  beforeDestroy () {
    if (this.intervalID !== null) {
      clearInterval(this.intervalID)
    }
  },
  watch: {
    solution: {
      handler (val) {
        this.solutions = [val]
      },
      deep: true
    }
  },
  computed: {
    result: function () {
      return SolutionResult[this.solution.status]
    }
  },
  methods: {
    fetch: function () {
      request({
        url: '/api/solution',
        params: { entry: this.$store.state.entry, id: this.id }
      })
        .then(solution => {
          this.solution = solution
        })
        .catch(e => {
          this.$store.commit('updateMessage', e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    rejudge: function () {
      this.loading = true
      request({
        url: '/api/solution',
        method: 'POST',
        params: { entry: this.$store.state.entry, id: this.id }
      })
        .then(() => {
          this.$store.commit('updateMessage', this.$t('rejudge_succeeded'))
        })
        .catch(e => {
          this.$store.commit('updateMessage', e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    remove: function () {
      this.loading = true
      request({
        url: '/api/solution',
        method: 'DELETE',
        params: { entry: this.$store.state.entry, id: this.id }
      })
        .then(() => {
          this.$router.push('/solution')
        })
        .catch(e => {
          this.$store.commit('updateMessage', e.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
