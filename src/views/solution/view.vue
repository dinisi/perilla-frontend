<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex>
        <v-card>
          <v-card-text>
            <v-data-table class="fullwidth" :headers="headers" :items="solutions" :loading="loading" hide-actions>
              <template slot="items" slot-scope="props">
                <tr>
                  <td>
                    <router-link  :to="'/solution/show/' + props.item.id">
                      {{ props.item.id }}
                    </router-link>
                  </td>
                  <td class="text-xs-right">
                    <router-link :to="'/problem/show/'+ props.item.problem">
                      {{ props.item.problem }}
                    </router-link>
                  </td>
                  <td class="text-xs-right">
                    <solution-result :result="props.item.status"/>
                  </td>
                  <td class="text-xs-right">{{ props.item.score }}</td>
                  <td class="text-xs-right">{{ new Date(props.item.updated).toLocaleString() }}</td>
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
import { request } from '../../http'
import render from '../../helpers/markdown'
import zJsonEditor from '@/components/zjsoneditor.vue'
import solutionResult from '@/components/solutionresult.vue'
import { showToast } from '../../swal'

export default {
  name: 'SolutionView',
  props: ['id'],
  components: {
    zJsonEditor,
    solutionResult
  },
  data () {
    return {
      headers: [
        { text: this.$t('ID'), align: 'left', sortable: false, value: 'id' },
        { text: this.$t('problem'), value: 'problem', sortable: false, class: 'text-xs-right' },
        { text: this.$t('status'), value: 'status', sortable: false, class: 'text-xs-right' },
        { text: this.$t('score'), value: 'score', sortable: false, class: 'text-xs-right' },
        { text: this.$t('updated'), value: 'updated', sortable: false, class: 'text-xs-right' },
        { text: this.$t('creator'), value: 'creator', sortable: false, class: 'text-xs-right' }
      ],
      solution: {
        id: null,
        problem: null,
        status: 0,
        score: 0,
        data: {},
        details: {},
        updated: null,
        owner: null,
        creator: null
      },
      solutions: [],
      loading: true,
      intervalID: null
    }
  },
  mounted () {
    this.solutions = [this.solution]
    this.enableAutoFetch()
  },
  beforeDestroy () {
    this.disableAutoFetch()
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
    enableAutoFetch: function () {
      if (this.intervalID === null) {
        this.loading = true
        this.fetch()
        this.intervalID = setInterval(this.fetch, 1000)
      }
    },
    disableAutoFetch: function () {
      if (this.intervalID !== null) {
        this.loading = false
        clearInterval(this.intervalID)
        this.intervalID = null
      }
    },
    fetch: function () {
      request({
        url: '/api/solution',
        params: { entry: this.$store.state.entry, id: this.id }
      })
        .then(solution => {
          this.solution = solution
          if (this.solution.status > 1) {
            this.disableAutoFetch()
          }
        })
        .catch(e => {
          showToast('error', 'error', e.message)
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
          showToast('success', 'rejudge_succeeded')
          this.enableAutoFetch()
        })
        .catch(e => {
          showToast('error', 'error', e.message)
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
          showToast('error', 'error', e.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
