<template>
  <v-container>
    <v-flex wrap>
      <v-card class="fill">
        <v-card-title class="headline" v-text="$t('batch_upload')" />
        <v-card-text>
          <input ref="file" type="file" multiple />
          <div v-for="(details, i) in uploadDetails" :key="i">
            {{ details.origin }}→{{ details.id }}
            <v-progress-linear v-model="details.progress" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="upload" v-text="$t('upload')" />
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-snackbar absolute v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import zMarkdownEditor from "@/components/zMarkdownEditor.vue";
import { request } from "@/http";

export default {
  name: "batchUpload",
  data() {
    return {
      uploadDetails: [],
      showSnackbar: false,
      snackbarText: null
    };
  },
  methods: {
    async upload() {
      const files = this.$refs.file.files;
      if (files) {
        for (let file of files) {
          const details = {
            progress: 0,
            origin: file.name,
            id: "pending"
          };
          const form = new FormData();
          form.append("file", file);
          request({
            url: "/api/file",
            params: { entry: this.$store.state.entry },
            method: "POST",
            data: form,
            onUploadProgress: e => {
              details.progress = Math.round((e.loaded * 100) / e.total);
            }
          })
            .then(id => {
              details.id = id;
            })
            .catch(err => {
              this.showSnackbar = true;
              this.snackbarText = err.message;
            });
          this.uploadDetails.push(details);
        }
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.fill
  height 100%
  overflow hidden
</style>
