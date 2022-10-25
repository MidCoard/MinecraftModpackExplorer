<script setup>
import FLink from '@/components/FLink.vue'
</script>

<template>
  <b-container fluid>
    <b-row class="justify-content-center">
      <b-col cols="12" md="6" sm="7">
        <b-input-group>
          <b-form-input v-model="search" placeholder="Search" />
          <b-input-group-append>
            <b-button variant="primary" @click="search">Search</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
  </b-container>
</template>
