<template>
  <v-container>
    <v-flex wrap>
      <v-card class="fill">
        <v-toolbar>
          <v-toolbar-items>
            <v-btn flat v-text="$t('edit')" :disabled="!loaded || view === 0" @click="view = 0"/>
            <v-btn flat v-text="$t('data')" :disabled="!loaded || view === 1" @click="view = 1"/>
          </v-toolbar-items>
          <v-spacer/>
          <v-toolbar-items>
            <v-menu offset-y>
              <v-btn flat slot="activator" v-text="$t('auto_generate')" />
              <v-list>
                <v-list-tile @click="generateTraditional">
                  <v-list-tile-title v-text="$t('traditional')" />
                </v-list-tile>
                <v-list-tile @click="generateDirect">
                  <v-list-tile-title v-text="$t('direct')" />
                </v-list-tile>
                <v-list-tile @click="generateVirtual">
                  <v-list-tile-title v-text="$t('virtual')" />
                </v-list-tile>
              </v-list>
            </v-menu>
            <v-btn flat v-text="$t('show')" @click="$router.push(`/problem/show/${problem._id}`)" :disabled="!id"/>
            <v-btn flat v-text="$t('save')" @click="save"/>
          </v-toolbar-items>
        </v-toolbar>
        <v-progress-linear indeterminate query v-if="showProgressBar"/>
        <template v-if="view === 0">
          <v-card-text>
            <v-text-field :label="$t('title')" v-model="problem.title"/>
            <z-markdown-editor v-model="problem.content"/>
            <v-combobox v-model="problem.tags" :label="$t('tags')" hide-selected multiple chips clearable/>
          </v-card-text>
        </template>
        <template v-if="view === 1">
          <!--  -->
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
        content: null,
        files: [],
        data: null,
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
