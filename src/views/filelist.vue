<template>
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-data-table
        class="fullwidth"
        :headers="headers"
        :items="files"
        :pagination.sync="pagination"
        :total-items="total"
        :loading="loading"
      >
        <template slot="items" slot-scope="props">
          <tr @click="$router.push('/file/show/' + props.item.id);">
            <td>{{ props.item.id }}</td>
            <td class="text-xs-right">{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.type }}</td>
            <td class="text-xs-right">{{ props.item.tags.join(",") }}</td>
            <td class="text-xs-right" style="width:128px;">
              {{ props.item.created }}
            </td>
            <td class="text-xs-right">{{ props.item.creator }}</td>
          </tr>
        </template>
        <template slot="actions-prepend">
          <v-btn flat to="/file/new" v-text="$t('new')" color="primary" />
          <v-btn flat to="/file/upload" v-text="$t('upload')" />
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from "@/http";

export default {
  name: "fileList",
  data() {
    return {
      headers: [
        { text: this.$t("ID"), align: "left", sortable: true, value: "id" },
        { text: this.$t("name"), value: "name" },
        { text: this.$t("type"), value: "type" },
        { text: this.$t("tags"), value: "tags" },
        { text: this.$t("created"), value: "created" },
        { text: this.$t("creator"), value: "creator" }
      ],
      files: [],
      pagination: null,
      total: 0,
      loading: true,
      fab: false
    };
  },
  watch: {
    pagination: {
      handler: function() {
        this.fetchData();
      },
      deep: true
    }
  },
  methods: {
    fetchData() {
      this.loading = true;
      const { sortBy, descending, page, rowsPerPage } = this.pagination;
      const params = {};
      Promise.all([
        request({
          url: "/api/file/list",
          params: Object.assign(
            {},
            { entry: this.$store.state.entry },
            { noexec: true }
          )
        }),
        request({
          url: "/api/file/list",
          params: Object.assign(
            {},
            { entry: this.$store.state.entry },
            { skip: (page - 1) * rowsPerPage, limit: rowsPerPage }
          )
        })
      ])
        .then(([count, items]) => {
          this.total = count;
          this.files = items;
        })
        .catch(err => {
          // Eat any error
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style lang="stylus" scoped>
.fullwidth
  width 100%
</style>
