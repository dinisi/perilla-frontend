<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex>
        <v-card>
          <v-card-title>
            <div>
              <div class="headline" v-text="entry._id" />
              <div class="subheading">{{ $t(EntryType[entry.type]) }}</div>
            </div>
          </v-card-title>
          <v-card-text>
            <b>{{ $t("email") }}:</b>
            <pre style="white-space: pre-wrap; word-wrap: break-word;">{{ entry.email }}</pre>
            <br/>
            <b>{{ $t("created") }}:</b>
            <pre style="white-space: pre-wrap; word-wrap: break-word;">{{ entry.created }}</pre>
            <br/>
            <b>{{ $t("description") }}:</b>
            <article class="markdown-body" v-html="rendered" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-text="$t('manage')" color="primary" to="/admin/manage" />
            <v-btn v-text="$t('edit')" to='/admin/edit/' />
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
import { EntryType } from '@/interfaces'

export default {
  name: 'adminMain',
  data () {
    return {
      entry: {
        _id: null,
        description: '',
        email: null,
        created: null,
        type: null
      },
      loading: true,
      EntryType
    }
  },
  mounted () {
    request({
      url: '/api/entry',
      params: { entry: this.$store.state.entry }
    })
      .then(entry => {
        this.entry = entry
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
      return render(this.entry.description)
    }
  }
}
</script>
