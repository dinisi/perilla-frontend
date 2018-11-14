<template>
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-data-table class="fullwidth" :headers="headers" :items="solutions" :pagination.sync="pagination" :total-items="total" :loading="loading">
        <template slot="items" slot-scope="props">
          <tr @click="$router.push('/solution/show/' + props.item.id)">
            <td>{{ props.item.id }}</td>
            <td class="text-xs-right">{{ props.item.problem }}</td>
            <td class="text-xs-right">{{ props.item.status }}</td>
            <td class="text-xs-right">{{ props.item.score }}</td>
            <td class="text-xs-right">{{ props.item.created }}</td>
            <td class="text-xs-right">{{ props.item.creator }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from "@/http";

export default {
  name: "solutionList",
  data() {
    return {
      headers: [
        { text: this.$t("ID"), align: "left", sortable: true, value: "id" },
        { text: this.$t("problem"), value: "problem" },
        { text: this.$t("status"), value: "status" },
        { text: this.$t("score"), value: "score" },
        { text: this.$t("created"), value: "created" },
        { text: this.$t("creator"), value: "creator" }
      ],
      solutions: [],
      pagination: null,
      total: 0,
      loading: true
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
          url: "/api/solution/list",
          params: Object.assign(
            {},
            { entry: this.$store.state.entry },
            { noexec: true }
          )
        }),
        request({
          url: "/api/solution/list",
          params: Object.assign(
            {},
            { entry: this.$store.state.entry },
            { skip: (page - 1) * rowsPerPage, limit: rowsPerPage }
          )
        })
      ])
        .then(([count, items]) => {
          this.total = count;
          this.solutions = items;
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
