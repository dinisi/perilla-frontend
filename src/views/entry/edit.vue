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
            <div class="body-1">{{ $t("description") }}:</div>
            <z-markdown-editor v-model="entry.description"/>
            <v-text-field type="password" v-if="entry.type === 0" v-model="entry.password" :label="$t('password')" :placeholder="$t('leave_blank_to_remain_unchanged')"/>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-text="$t('remove')" color="warning" @click="remove"/>
            <v-btn v-text="$t('save')" color="primary" @click="update"/>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from '@/helpers/http'
import zMarkdownEditor from '@/components/zmarkdowneditor.vue'
import { EntryType } from '@/helpers/misc'
import { showToast, showDialog } from '@/swal'

export default {
  name: 'adminEdit',
  components: {
    zMarkdownEditor
  },
  props: ['id'],
  data () {
    return {
      entry: {
        _id: null,
        description: '',
        email: null,
        created: null,
        type: null
      },
      EntryType
    }
  },
  watch: {
    'id': {
      handler: function () {
        this.$store.commit('toggleLoading', true)
        request({
          url: '/api/entry',
          params: { entry: this.id }
        })
          .then(entry => {
            this.entry = entry
          })
          .catch(e => {
            showToast('error', 'error', e.message)
          })
          .finally(() => {
            this.$store.commit('toggleLoading', false)
          })
      },
      immediate: true
    }
  },
  methods: {
    update () {
      this.$store.commit('toggleLoading', true)
      request({
        url: '/api/entry',
        method: 'PUT',
        params: { entry: this.id },
        data: this.entry
      }).then(() => {
        showToast('success', 'succeeded')
      }).catch(e => {
        showToast('error', 'error', e.message)
      }).finally(() => {
        this.$store.commit('toggleLoading', false)
      })
    },
    async remove () {
      if (!await showDialog('warning', 'think_twice', this.$t('all_user_data_will_be_removed_and_cannot_be_recovered'))) return
      this.$store.commit('toggleLoading', true)
      request({
        url: '/api/entry',
        method: 'DELETE',
        params: { entry: this.id }
      }).then(() => {
        showToast('success', 'succeeded')
      }).catch(e => {
        showToast('error', 'error', e.message)
      }).finally(() => {
        this.$store.commit('toggleLoading', false)
      })
    }
  }
}
</script>
