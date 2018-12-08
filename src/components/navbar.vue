<template>
  <v-toolbar app>
    <v-toolbar-side-icon v-if="token" @click="show = !show;" />
    <v-toolbar-items>
      <v-btn class="headline" flat to="/">Perilla</v-btn>
      <v-btn flat to="/problem" v-text="$t('problem')" />
      <v-btn flat to="/file" v-text="$t('file')" />
      <v-btn flat to="/solution" v-text="$t('solution')" />
      <v-btn flat to="/article" v-text="$t('article')" />
    </v-toolbar-items>
    <v-spacer />
    <v-toolbar-items>
      <template v-if="token">
        <v-menu open-on-hover bottom offset-y>
          <v-btn flat slot="activator" to="/logout" v-text="$t('logout')"/>
          <v-list>
            <v-list-tile to="/settings">
              <v-list-tile-avatar>
                <v-icon>settings</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-title v-text="$t('settings')"/>
            </v-list-tile>
            <v-list-tile to="/creategroup">
              <v-list-tile-avatar>
                <v-icon>group_add</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-title v-text="$t('create_group')"/>
            </v-list-tile>
          </v-list>
        </v-menu>
      </template>
      <template v-else>
        <v-menu open-on-hover bottom offset-y>
          <v-btn slot="activator" depressed to="/login" color="primary" v-text="$t('login')"/>
          <v-list>
            <v-list-tile to="/settings">
              <v-list-tile-avatar>
                <v-icon>settings</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-title v-text="$t('settings')"/>
            </v-list-tile>
            <v-list-tile to="/register">
              <v-list-tile-avatar>
                <v-icon>person_add</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-title v-text="$t('register')"/>
            </v-list-tile>
          </v-list>
        </v-menu>
      </template>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: 'Navbar',
  props: ['value'],
  model: {
    prop: 'value',
    event: 'update'
  },
  watch: {
    value: function (val) {
      if (val === this.show) return
      this.show = val
    },
    show: function (val) {
      if (val === this.value) return
      this.$emit('update', val)
    }
  },
  data () {
    return {
      show: false
    }
  },
  created () {
    this.show = this.value
  },
  methods: {
    //
  },
  computed: {
    token: function () {
      return this.$store.state.token
    }
  }
}
</script>
