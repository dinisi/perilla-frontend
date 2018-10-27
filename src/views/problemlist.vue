<template>
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-data-table :headers="headers" :items="problems" :pagination.sync="pagination" :total-items="total" :loading="loading">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.calories }}</td>
          <td class="text-xs-right">{{ props.item.fat }}</td>
          <td class="text-xs-right">{{ props.item.carbs }}</td>
          <td class="text-xs-right">{{ props.item.protein }}</td>
          <td class="text-xs-right">{{ props.item.iron }}</td>
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from "@/http";

export default {
  name: "problemList",
  props: ["URL", "query"],
  data() {
    return {
      headers: [
        { text: "ID", align: "left", sortable: true, value: "id" },
        { text: "title", value: "title" },
        { text: "tags", value: "tags" },
        { text: "created", value: "created" },
        { text: "public", value: "public" }
      ],
      problems,
      pagination: null,
      total: 0,
      loading: true
    };
  },
  methods: {
    fetchData() {
      const { sortBy, descending, page, rowsPerPage } = this.pagination;
      const params = {};
      Object.assign(params, this.query);
      Object.assign(params, {
        skip: (page - 1) * rowsPerPage,
        limit: rowsPerPage
      });
      Promise.all([
        request({
          url: this.URL + "/count",
          params
        }),
        request({
          url: this.URL + "/list",
          params
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
          this.loading = true;
        });
    }
  }
};
</script>
