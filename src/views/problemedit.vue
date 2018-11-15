<template>
  <v-container>
    <v-flex wrap>
      <v-card class="fill">
        <v-toolbar>
          <v-toolbar-title v-text="$t('edit_problem', [problem.id])" />
          <v-toolbar-items>
            <v-btn
              flat
              v-text="$t('edit')"
              :disabled="view === 0"
              @click="view = 0;"
            />
            <v-btn
              flat
              v-text="$t('data')"
              :disabled="view === 1"
              @click="view = 1;"
            />
          </v-toolbar-items>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              flat
              v-text="$t('remove')"
              :disabled="isnew"
              @click="remove"
              color="accent"
            />
            <v-btn flat v-text="$t('save')" @click="save" color="primary" />
            <v-btn
              flat
              v-text="$t('show')"
              :disabled="isnew"
              :to="'/problem/show/' + id"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-progress-linear indeterminate query v-if="loading" />
        <v-card-text v-show="view === 0">
          <v-text-field :label="$t('title')" v-model="problem.title" />
          <z-markdown-editor v-model="problem.content" />
          <v-combobox
            v-model="problem.tags"
            :label="$t('tags')"
            hide-selected
            multiple
            chips
            clearable
          />
        </v-card-text>
        <v-card-text v-show="view === 1">
          <v-text-field :label="$t('channel')" v-model="problem.channel" />
          <z-json-editor v-model="problem.data" />
        </v-card-text>
      </v-card>
    </v-flex>
    <v-snackbar absolute v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import zJsonEditor from "@/components/zJsonEditor.vue";
import zMarkdownEditor from "@/components/zMarkdownEditor.vue";
import { request } from "@/http";

export default {
  name: "problemEdit",
  components: {
    zJsonEditor,
    zMarkdownEditor
  },
  props: ["id"],
  data() {
    return {
      problem: {
        id: null,
        title: "New problem",
        content: "",
        data: {},
        channel: null,
        tags: [],
        created: null,
        owner: null,
        creator: null
      },
      loading: true,
      showSnackbar: false,
      snackbarText: "",
      view: 0,
      isnew: false
    };
  },
  async mounted() {
    if (this.id) {
      request({
        url: "/api/problem",
        params: { entry: this.$store.state.entry, id: this.id }
      })
        .then(problem => {
          this.problem = problem;
        })
        .catch(err => {
          this.showSnackbar = true;
          this.snackbarText = err.message;
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      this.isnew = true;
      this.loading = false;
    }
  },
  methods: {
    async save() {
      this.loading = true;
      if (this.isnew) {
        request({
          url: "/api/problem",
          params: { entry: this.$store.state.entry },
          method: "POST",
          data: this.problem
        })
          .then(id => {
            this.$router.push("/problem/show/" + id);
          })
          .catch(err => {
            this.showSnackbar = true;
            this.snackbarText = err.message;
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        request({
          url: "/api/problem",
          params: { entry: this.$store.state.entry, id: this.id },
          method: "PUT",
          data: this.problem
        })
          .catch(err => {
            this.showSnackbar = true;
            this.snackbarText = err.message;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    async remove() {
      this.loading = true;
      request({
        url: "/api/problem",
        params: { entry: this.$store.state.entry, id: this.id },
        method: "DELETE"
      })
        .catch(err => {
          this.showSnackbar = true;
          this.snackbarText = err.message;
        })
        .finally(() => {
          this.$router.push("/problem");
          this.loading = false;
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
