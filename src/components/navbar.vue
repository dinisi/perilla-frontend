<template>
  <v-toolbar app>
    <v-toolbar-side-icon @click="show = !show;" />
    <v-toolbar-items>
      <v-btn class="headline text-uppercase" flat to="/"> Perilla </v-btn>
      <v-btn flat to="/problem" v-text="$t('problem')" />
      <v-btn flat to="/file" v-text="$t('file')" />
      <v-btn flat to="/solution" v-text="$t('solution')" />
      <v-btn flat to="/article" v-text="$t('article')" />
      <v-btn flat to="/message" v-text="$t('message')" />
      <v-btn flat to="/admin" v-text="$t('admin')" />
    </v-toolbar-items>
    <v-spacer />
    <v-toolbar-items>
      <template v-if="login">
        <v-btn flat to="/logout" v-text="$t('logout')" />
      </template>
      <template v-else>
        <v-btn depressed to="/login" color="primary" v-text="$t('login')" />
        <v-btn flat to="/register" v-text="$t('register')" />
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
    login: function () {
      return this.$store.state.login
    }
  }
}
</script>
