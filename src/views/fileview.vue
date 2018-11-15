<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex>
        <v-card>
          <v-card-title>
            <div>
              <div class="headline" v-text="file.name" />
              <div class="subheading">{{ file.creator }}</div>
            </div>
          </v-card-title>
          <v-card-text>
            <b>{{ $t("hash") }}:</b>
            <pre style="white-space: pre-wrap; word-wrap: break-word;">{{ file.hash }}</pre>
            <br/>
            <b>{{ $t("size") }}:</b>
            <pre>{{ file.size }}</pre>
            <br/>
            <b>{{ $t("type") }}:</b>
            <pre>{{ file.type }}</pre>
            <br/>
            <article class="markdown-body" v-html="rendered" />
          </v-card-text>
          <v-card-actions>
            <v-chip label v-for="(tag, i) in file.tags" v-text="tag" :key="i" />
            <v-spacer />
            <v-btn v-text="$t('download')" color="primary" />
            <v-btn v-text="$t('edit')" :to="'/file/edit/' + id" />
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

export default {
  name: 'FileView',
  props: ['id'],
  data () {
    return {
      file: {
        id: null,
        name: 'Loading',
        type: '',
        description: '',
        hash: '',
        size: 0,
        created: null,
        tags: [],
        owner: null,
        creator: null
      },
      loading: true
    }
  },
  mounted () {
    request({
      url: '/api/file',
      params: { entry: this.$store.state.entry, id: this.id }
    })
      .then(file => {
        this.file = file
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
      return render(this.file.description)
    }
  }
}
</script>
