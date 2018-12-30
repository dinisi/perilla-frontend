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
            <v-chip v-for="(tag, i) in problem.tags" :key="i">{{ tag }}</v-chip>
            <v-spacer />
            <v-btn v-text="$t('edit')" :to="'/problem/edit/' + id" />
          </v-card-actions>
        </v-card>

        <v-card v-if="!!problem.channel">
          <v-card-title>
            <div>
              <div class="headline" v-text="$t('submit')" />
              <div class="subheading" v-text="problem.channel" />
            </div>
          </v-card-title>
          <v-card-text>
            <traditional-submit v-if="['traditional', 'bzoj', 'uoj', 'poj', 'hdu', 'loj', 'atcoder'].includes(problem.channel)" v-model="solution.data" :valid.sync="valid"/>
            <z-json-editor v-else v-model="solution.data" :valid.sync="valid"/>
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
            <v-btn v-text="$t('submit')" @click="submit" color="primary" :disabled="!valid"/>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from '@/helpers/http'
import render from '@/helpers/markdown'
import traditionalSubmit from '@/components/traditionalsubmit.vue'
import zJsonEditor from '@/components/zjsoneditor.vue'
import { showToast } from '@/swal'

export default {
  name: 'ProblemView',
  props: ['id'],
  components: {
    traditionalSubmit,
    zJsonEditor
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
        updated: null,
        owner: null,
        creator: null
      },
      solution: {
        data: {}
      },
      valid: false
    }
  },
  watch: {
    id: {
      immediate: true,
      handler: function () {
        this.$store.commit('toggleLoading', true)
        request({
          url: '/api/problem',
          params: { entry: this.$store.state.entry, id: this.id }
        })
          .then(problem => {
            this.problem = problem
          })
          .catch(e => {
            showToast('error', 'error', e.message)
          })
          .finally(() => {
            this.$store.commit('toggleLoading', false)
          })
      }
    }
  },
  computed: {
    rendered: function () {
      return render(this.problem.content)
    }
  },
  methods: {
    submit () {
      this.$store.commit('toggleLoading', true)
      request({
        url: '/api/problem/submit',
        params: { entry: this.$store.state.entry, id: this.id },
        data: this.solution,
        method: 'POST'
      })
        .then(id => {
          this.$router.push('/solution/show/' + id)
        })
        .catch(e => {
          showToast('error', 'error', e.message)
        })
        .finally(() => {
          this.$store.commit('toggleLoading', false)
        })
    }
  }
}
</script>
