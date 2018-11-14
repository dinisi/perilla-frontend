<template>
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-data-table :headers="headers" :items="problems" :pagination.sync="pagination" :total-items="total" :loading="loading">
        <template slot="items" slot-scope="props">
          <tr @click="$router.push('/problem/show/' + props.item.id)">
            <td>{{ props.item.id }}</td>
            <td class="text-xs-right">{{ props.item.title }}</td>
            <td class="text-xs-right">{{ props.item.tags.join(',') }}</td>
            <td class="text-xs-right">{{ props.item.created }}</td>
            <td class="text-xs-right">{{ props.item.creator }}</td>
          </tr>
        </template>
        <template slot="footer">
          <v-btn v-text="$t('new')" to="/problem/new"/>
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from "@/http";

export default {
  name: "problemList",
  data() {
    return {
      headers: [
        { text: this.$t("ID"), align: "left", sortable: true, value: "id" },
        { text: this.$t("title"), value: "title" },
        { text: this.$t("tags"), value: "tags" },
        { text: this.$t("created"), value: "created" },
        { text: this.$t("creator"), value: "creator" }
      ],
      problems: [],
      pagination: null,
      total: 0,
      loading: true
    };
  },
  methods: {
    fetchData() {
      const { sortBy, descending, page, rowsPerPage } = this.pagination;
      const params = {};
      Promise.all([
        request({
          url: "/api/problem/list",
          params: Object.assign(
            {},
            { entry: this.$store.state.entry },
            { noexec: true }
          )
        }),
        request({
          url: "/api/problem/list",
          params: Object.assign(
            {},
            { entry: this.$store.state.entry },
            { skip: (page - 1) * rowsPerPage, limit: rowsPerPage }
          )
        })
      ])
        .then(([count, items]) => {
          this.total = count;
          this.problems = items;
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
