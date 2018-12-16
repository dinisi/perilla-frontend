<template>
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-data-table :rows-per-page-items="[5, 10, 15, 25, 50]" class="fullwidth" :headers="headers" :items="solutions" :pagination.sync="pagination" :total-items="total" :loading="loading">
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
        <template slot="actions-prepend">
          <v-btn flat v-text="$t('condition')" @click="showCondDialog = true"/>
        </template>
      </v-data-table>
    </v-layout>
    <v-dialog v-model="showCondDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline" v-text="$t('condition')"/>
        <v-card-text>
          <v-text-field v-model="problem" :label="$t('problem')" type="number"/>
          <v-select :items="statusItems" v-model="status" :label="$t('language')"/>
          <v-text-field v-model="min" :label="$t('min')" type="number" min="0" max="100"/>
          <v-text-field v-model="max" :label="$t('max')" type="number" min="0" max="100"/>
          <v-text-field v-model="creator" :label="$t('creator')"/>
          <v-text-field v-model="before" :label="$t('before')" mask="####/##/## ##:##" :return-masked-value="true"/>
          <v-text-field v-model="after" :label="$t('after')" mask="####/##/## ##:##" :return-masked-value="true"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" v-text="$t('apply')" @click="fetchData()"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { request } from '@/http'
import solutionResult from '@/components/solutionresult.vue'
import { getStorage, setStorage } from '@/storage'
import { resultDisplay, SolutionResult as results } from '@/interfaces'
import { showToast } from '@/swal'

export default {
  name: 'SolutionList',
  components: {
    solutionResult
  },
  data () {
    return {
      headers: [
        { text: this.$t('ID'), align: 'left', sortable: true, value: 'id' },
        { text: this.$t('problem'), value: 'problem', sortable: false, class: 'text-xs-right' },
        { text: this.$t('status'), value: 'status', sortable: false, class: 'text-xs-right' },
        { text: this.$t('score'), value: 'score', sortable: true, class: 'text-xs-right' },
        { text: this.$t('updated'), value: 'updated', sortable: true, class: 'text-xs-right' },
        { text: this.$t('creator'), value: 'creator', sortable: false, class: 'text-xs-right' }
      ],
      solutions: [],
      pagination: {
        descending: true,
        page: 1,
        rowsPerPage: getStorage(localStorage, 'lastSolutionListRPP') || 15,
        sortBy: 'id',
        totalItems: 0
      },
      total: 0,
      loading: true,
      showCondDialog: false,
      problem: null,
      min: null,
      max: null,
      creator: null,
      before: null,
      after: null,
      status: null,
      statusItems: resultDisplay.map(x => this.$t(x.text)).concat(this.$t('all'))
    }
  },
  watch: {
    pagination: {
      handler: function () {
        this.fetchData()
      },
      deep: true
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      setStorage(localStorage, 'lastSolutionListRPP', rowsPerPage)
      const params = { sortBy, descending: descending || undefined }
      const condition = this.getCondition()
      Promise.all([
        request({
          url: '/api/solution/list',
          params: Object.assign(
            { entry: this.$store.state.entry },
            { noexec: true },
            params,
            condition
          )
        }),
        request({
          url: '/api/solution/list',
          params: Object.assign(
            { entry: this.$store.state.entry },
            { skip: (page - 1) * rowsPerPage, limit: rowsPerPage },
            params,
            condition
          )
        })
      ])
        .then(([count, items]) => {
          this.total = count
          this.solutions = items
        })
        .catch(e => {
          showToast('error', 'error', e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    getCondition () {
      let condition = {}
      if (this.problem) {
        condition.problem = parseInt(this.problem)
      }
      if (this.min && parseInt(this.min)) {
        condition.min = parseInt(this.min)
      }
      if (this.max && parseInt(this.max)) {
        condition.max = parseInt(this.max)
      }
      if (this.before && this.before.trim()) {
        condition.before = +new Date(this.before)
      }
      if (this.after && this.after.trim()) {
        condition.after = +new Date(this.after)
      }
      if (this.creator && this.creator.trim()) {
        condition.creator = this.creator
      }
      if (results[this.status] !== undefined) {
        condition.status = results[this.status]
      }
      return condition
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>

<style lang="stylus" scoped>
.fullwidth
  width 100%
</style>
