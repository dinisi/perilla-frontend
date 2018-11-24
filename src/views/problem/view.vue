<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex sm12>
        <v-card>
          <v-card-title>
            <div>
              <div class="headline" v-text="problem.title" />
              <div class="subheading">{{ problem.creator }}</div>
            </div>
          </v-card-title>
          <v-card-text>
            <article class="markdown-body" v-html="rendered" />
          </v-card-text>
          <v-card-actions>
            <v-chip label v-for="(tag, i) in problem.tags" v-text="tag" :key="i"/>
            <v-spacer />
            <v-btn v-text="$t('show_submit_form')" color="primary" @click="showSubmit = true;" :disabled="showSubmit"/>
            <v-btn v-text="$t('edit')" :to="'/problem/edit/' + id" />
          </v-card-actions>
        </v-card>
        <v-card v-if="showSubmit">
          <v-card-title class="headline" v-text="$t('submit')" />
          <v-card-text>
            <submit-form v-model="solution.data" :channel="problem.channel"/>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-menu offset-y>
              <v-btn v-text="$t('create_file')" slot="activator"/>
              <v-list>
                <v-list-tile to="/file/upload">
                  <v-list-tile-title v-text="$t('upload')"/>
                </v-list-tile>
                <v-list-tile to="/file/new">
                  <v-list-tile-title v-text="$t('create')"/>
                </v-list-tile>
              </v-list>
            </v-menu>
            <v-btn v-text="$t('submit')" @click="submit" color="primary" />
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="loading" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          {{ $t('please_wait') }}
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { request } from '@/http'
import render from '@/helper/markdown'
import submitForm from '@/components/submitform.vue'

export default {
  name: 'ProblemView',
  props: ['id'],
  components: {
    submitForm
  },
  data () {
    return {
      problem: {
        id: null,
        title: 'Loading',
        content: '',
        data: {},
        channel: null,
        tags: ['Untagged'],
        created: null,
        owner: null,
        creator: null
      },
      solution: {
        data: {}
      },
      loading: true,
      showSubmit: false
    }
  },
  mounted () {
    request({
      url: '/api/problem',
      params: { entry: this.$store.state.entry, id: this.id }
    })
      .then(problem => {
        this.problem = problem
      })
      .catch(e => {
        this.$store.commit('updateMessage', e.message)
      })
      .finally(() => {
        this.loading = false
      })
  },
  computed: {
    rendered: function () {
      return render(this.problem.content)
    }
  },
  methods: {
    submit () {
      this.loading = true
      request({
        url: '/api/problem/submit',
        params: { entry: this.$store.state.entry, id: this.id },
        data: this.solution,
        method: 'POST'
      })
        .then(id => {
          this.$router.push('/solution/show/'+id)
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