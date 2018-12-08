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
  </v-container>
</template>

<script>
import { request } from '../..//http'
import zMarkdownEditor from '../..//components/zmarkdowneditor.vue'
import { EntryType } from '../..//interfaces'

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
  mounted () {
    this.$store.commit('toggleLoading', true)
    request({
      url: '/api/entry',
      params: { entry: this.id }
    })
      .then(entry => {
        this.entry = entry
      })
      .catch(e => {
        this.$store.commit('updateMessage', e.message)
      })
      .finally(() => {
        this.$store.commit('toggleLoading', false)
      })
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
        this.$store.commit('updateMessage', this.$t('succeeded'))
      }).catch(e => {
        this.$store.commit('updateMessage', e.message)
      }).finally(() => {
        this.$store.commit('toggleLoading', false)
      })
    }
  }
}
</script>
