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
            <v-text-field type="email" v-model="entry.email" :label="$t('email')"/>
            <b>{{ $t("description") }}:</b>
            <z-markdown-editor v-model="entry.description"/>
            <v-text-field type="password" v-if="entry.type === 0" v-model="entry.password" :label="$t('password')" :placeholder="$t('leave_blank_to_remain_unchanged')"/>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-text="$t('save')" color="primary" @click="update"/>
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
import zMarkdownEditor from '@/components/zMarkdownEditor.vue'
import { EntryType } from '@/interfaces'

export default {
  name: 'adminEdit',
  components: {
    zMarkdownEditor
  },
  data () {
    return {
      entry: {
        _id: null,
        description: null,
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
  methods: {
    update () {
      this.loading = true
      request({
        url: '/api/entry',
        method: 'PUT',
        params: { entry: this.$store.state.entry },
        data: this.entry
      }).then(() => {
        this.$store.commit('updateMessage', this.$t('succeeded'))
      }).catch(e => {
        this.$store.commit('updateMessage', e.message)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
