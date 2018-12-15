<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex sm12>
        <v-card>
          <v-card-title class="headline" v-text="$t('debugger')"/>
          <v-card-text>
            <v-text-field :label="$t('url')"/>
            <v-select :label="$t('method')" :items="['POST']"/>
          </v-card-text>
          <v-card-actions>

          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
