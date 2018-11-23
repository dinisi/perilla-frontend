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
            <b>{{ $t("problem") }}:</b>
            <pre>{{ solution.problem }}</pre>
            <br/>
            <b>{{ $t("status") }}:</b>
            <pre>{{ result }}</pre>
            <br/>
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
    <v-dialog v-model="loading" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
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
      loading: true,
      intervalID: null
    }
  },
  mounted () {
    this.fetch()
    this.intervalID = setInterval(this.fetch, 5000)
  },
  beforeDestroy () {
    if (this.intervalID !== null) {
      clearInterval(this.intervalID)
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
