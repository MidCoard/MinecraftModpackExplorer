<template>
  <b-container fluid>
    <b-row class="justify-content-center mt-3">
      <b-col cols="12" sm="7">
        <h1 style="display: inline">{{$t('status.title')}}</h1>
        <span class="float-end">
          <b-button @click="$router.push({name: 'home'})">{{$t('search.back')}}</b-button>
        </span>
      </b-col>
    </b-row>
    <b-row v-show="!showError && !loading" class="justify-content-center mt-3">
      <b-col cols="12" sm="7">
        <p>
          {{$t('status.available-mods')}}: {{overview.availableMods}}
        </p>
        <p>
          {{$t('status.available-modpacks')}}: {{overview.availableModpacks}}
        </p>
        <p>
          {{$t('status.not-available-modpacks')}}: {{overview.notAvailableModpacks}}
        </p>
        <p>
          {{$t('status.not-empty-modpacks')}}: {{overview.notEmptyModpacks}}
        </p>
      </b-col>
    </b-row>
    <b-row v-show="loading" class="justify-content-center">
      <b-col cols="auto">
        <hr class="my-4 invisible"/>
        <hr class="my-4 invisible"/>
        <hr class="my-4 invisible"/>
        <div class="spinner-border text-secondary" role="status" style="width: 5rem;height: 5rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <hr class="my-4 invisible"/>
        <hr class="my-4 invisible"/>
        <hr class="my-4 invisible"/>
      </b-col>
    </b-row>
    <b-row v-show="showError" class="justify-content-center">
      <b-col cols="12" sm="7">
        <b-alert show variant="danger" class="mt-3">
          {{errorMessage}}
        </b-alert>
      </b-col>
    </b-row>
  </b-container>
</template>

<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";
import {useConstants} from "@/stores/useConstants";

const constants = useConstants()

let overview = ref({})

let errorMessage = ref('')
let showError = ref(false)

let loading = ref(true)

onMounted(() => {
  grecaptcha.ready(function () {
    grecaptcha.execute('6LdQjSYiAAAAAG9rVoUJxVajIae3snOj9J1f6iOd', {action: 'mod_overview'}).then(function (token) {
      axios.post(`${constants.apiUrl}v1/focessapi/minecraft/overview`,{
        recaptcha: token,
      }).then(res => {
        overview.value = res.data
        loading.value = false
      }).catch(() => {
        errorMessage.value = t('status.network-error')
        showError.value = true
        loading.value = false
      })
    })
  })
})
</script>

<style scoped>

</style>