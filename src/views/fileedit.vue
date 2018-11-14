<template>
  <v-container>
    <v-flex wrap>
      <v-card class="fill">
        <v-toolbar>
          <v-toolbar-title v-text="$t('edit_file', [file.id])"/>
          <v-toolbar-items>
            <v-btn flat v-text="$t('edit')" :disabled="view === 0" @click="view = 0"/>
            <v-btn flat v-text="$t('raw')" :disabled="view === 1" @click="view = 1"/>
          </v-toolbar-items>
          <v-spacer/>
          <v-toolbar-items>
            <v-btn flat v-text="$t('remove')" :disabled="isnew" @click="remove" color="accent"/>
            <v-btn flat v-text="$t('save')" @click="save" color="primary"/>
            <v-btn flat v-text="$t('show')" :disabled="isnew" :to="'/file/show/' + id"/>
          </v-toolbar-items>
        </v-toolbar>
        <v-progress-linear indeterminate query v-if="loading"/>
        <template v-if="view === 0">
          <v-card-text>
            <v-text-field :label="$t('name')" v-model="file.name"/>
            <z-markdown-editor v-model="file.description"/>
            <v-combobox v-model="file.tags" :label="$t('tags')" hide-selected multiple chips clearable/>
          </v-card-text>
        </template>
        <template v-if="view === 1">
          <v-card-text>
            <b>{{ $t("hash") }}:</b><pre style="white-space: pre-wrap; word-wrap: break-word;">{{ file.hash }}</pre><br/>
            <b>{{ $t("size") }}:</b><pre>{{ file.size }}</pre><br/>
            <input ref="file" type="file">
          </v-card-text>
        </template>
      </v-card>
    </v-flex>
    <v-snackbar v-model="showSnackbar" absolute>
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import zMarkdownEditor from "@/components/zMarkdownEditor.vue";
import { request } from "@/http";

export default {
  name: "fileEditView",
  props: ["id"],
  components: {
    zMarkdownEditor
  },
  data() {
    return {
      file: {
        id: null,
        name: "New file",
        type: "",
        description: "",
        hash: "",
        size: 0,
        created: null,
        tags: [],
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
        url: "/api/file",
        params: { entry: this.$store.state.entry, id: this.id }
      })
        .then(file => {
          this.file = file;
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
      let form = new FormData();
      form.append("name", this.file.name);
      form.append("type", this.file.name);
      form.append("description", this.file.description);
      form.append("tags", JSON.stringify(this.file.tags));
      if (this.$refs.file && this.$refs.file.files) {
        form.append("file", this.$refs.file.files[0]);
      }
      this.loading = true;
      if (this.isnew) {
        request({
          url: "/api/file",
          params: { entry: this.$store.state.entry },
          method: "POST",
          data: form
        })
          .then(id => {
            this.$router.push("/file/show/" + id);
          })
          .catch(err => {
            this.showSnackbar = true;
            this.snackbarText = err.message;
          })
          .finally(() => {
            this.loading = false;
            this.$refs.file.files = null;
          });
      } else {
        request({
          url: "/api/file",
          params: { entry: this.$store.state.entry, id: this.id },
          method: "PUT",
          data: form
        })
          .catch(err => {
            this.showSnackbar = true;
            this.snackbarText = err.message;
          })
          .finally(() => {
            this.loading = false;
            this.$refs.file.files = null;
          });
      }
    },
    async remove() {
      this.loading = true;
      request({
        url: "/api/file",
        params: { entry: this.$store.state.entry, id: this.id },
        method: "DELETE"
      })
        .catch(err => {
          this.showSnackbar = true;
          this.snackbarText = err.message;
        })
        .finally(() => {
          this.$router.push("/file");
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
