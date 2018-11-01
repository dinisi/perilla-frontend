<template>
  <v-container>
    <v-flex wrap>
      <v-card class="fill">
        <v-toolbar>
          <v-toolbar-items>
            <v-btn flat v-text="$t('edit')" :disabled="view === 0" @click="view = 0"/>
            <v-btn flat v-text="$t('data')" :disabled="view === 1" @click="view = 1"/>
          </v-toolbar-items>
          <v-spacer/>
          <v-toolbar-items>
            <v-btn flat v-text="$t('save')" @click="save"/>
          </v-toolbar-items>
        </v-toolbar>
        <v-progress-linear indeterminate query v-if="loading"/>
        <template v-if="view === 0">
          <v-card-text>
            <v-text-field :label="$t('title')" v-model="problem.title"/>
            <z-markdown-editor v-model="problem.content"/>
            <v-combobox v-model="problem.tags" :label="$t('tags')" hide-selected multiple chips clearable/>
          </v-card-text>
        </template>
        <template v-if="view === 1">
          <z-json-editor v-model="problem.data"/>
        </template>
      </v-card>
    </v-flex>
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import zJsonEditor from "@/components/zJsonEditor.vue";
import zMarkdownEditor from "@/components/zMarkdownEditor.vue";
import { request } from "@/http";

const programExts = ["c", "cpp", "java", "js"];
const testcaseExts = ["in", "out", "ans"];

export default {
  name: "problemEditView",
  components: {
    zJsonEditor,
    zMarkdownEditor
  },
  props: ["URL", "query"],
  data() {
    return {
      problem: {
        id: null,
        title: null,
        content: "",
        files: [],
        data: {},
        channel: null,
        tags: [],
        created: null,
        owner: null,
        creator: null,
        public: null
      },
      loading: true,
      showSnackbar: false,
      snackbarText: "",
      view: 0,
      isnew: false
    };
  },
  async mounted() {
    request({
      url: this.URL,
      params: this.query
    })
      .then(problem => {
        this.problem = problem;
      })
      .catch(err => {
        this.isnew = true;
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    async save() {
      this.showProgressBar = true;
      request({
        url: this.URL,
        params: this.query,
        method: "POST",
        data: this.problem
      })
        .catch(err => {
          //
        })
        .finally(() => {
          this.loaded = false;
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.fill
  height 100%
  overflow hidden
</style>
