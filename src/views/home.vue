<template>
  <v-container fluid grid-list-md>
    <v-layout row justify-space-between>
      <v-flex xs3>
        <v-card class="pa-2 first-line" hover>
          <img width="100%" height="100%" src="@/assets/logo.svg"/>
        </v-card>
      </v-flex>
      <v-flex xs9>
        <hitokoto class="pa-2 first-line"/>
      </v-flex>
    </v-layout>
    <v-layout row v-if="$store.state.token" justify-space-between wrap>
      <v-flex xs4 sm2>
        <article-count class="second-line"/>
      </v-flex>
      <v-flex xs4 sm2>
        <problem-count class="second-line"/>
      </v-flex>
      <v-flex xs4 sm2>
        <solution-count class="second-line"/>
      </v-flex>
      <v-flex xs4 sm2>
        <file-count class="second-line"/>
      </v-flex>
      <v-flex xs4 sm2>
        <user-count class="second-line"/>
      </v-flex>
      <v-flex xs4 sm2>
        <v-card class="second-line" hover>
          <v-card-title class="subheading" v-text="$t('link')"/>
          <v-card-text>
            <ul>
              <li><a href="https://github.com/ZhangZisu/perilla-frontend/wiki" target="_blank">{{ $t('help') }}</a></li>
              <li><a href="https://github.com/ZhangZisu/perilla-frontend/issues/new" target="_blank">{{ $t('feedback') }}</a></li>
            </ul>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row v-else justify-space-around>
      <login/>
    </v-layout>
  </v-container>
</template>

<script>
import hitokoto from '@/components/hitokoto'
import articleCount from '@/components/articlecount'
import problemCount from '@/components/problemcount'
import solutionCount from '@/components/solutioncount'
import fileCount from '@/components/filecount'
import userCount from '@/components/usercount'
import login from '@/views/login'

export default {
  name: 'home',
  components: {
    hitokoto,
    articleCount,
    problemCount,
    solutionCount,
    fileCount,
    userCount,
    login
  }
}
</script>

<style lang="stylus" scoped>
.first-line
  height 200px

.second-line
  height 150px
</style>
