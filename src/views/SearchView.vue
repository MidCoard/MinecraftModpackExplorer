<template>

</template>

<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import {useConstants} from "@/stores/useConstants";
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";

const constants = useConstants()

const {t} = useI18n()

const route = useRoute()

let errorMessage2 = ref('')
let showError2 =  ref(false)
let loadingSearchModpacks = ref(false)

onMounted(() => {
  searchModpacks()
})

function searchModpacks() {
  loadingSearchModpacks.value = true
  showError2.value = false
  grecaptcha.ready(function () {
    grecaptcha.execute('6LdQjSYiAAAAAG9rVoUJxVajIae3snOj9J1f6iOd', {action: 'search_modpacks'}).then(function (token) {
      axios.post(`${constants.apiUrl}v1/focessapi/minecraft/modpack/depend`,{
        ids: JSON.parse(route.params.ids),
        recaptcha: token,
        sortType: 4,
        sortBy: 1
      }).then(res => {
        if (res.data.length === 0 ) {
          errorMessage2.value = t('search.not-found-error')
          showError2.value = true
        }
        console.log(res.data)
        loadingSearchModpacks.value = false
      }).catch(() => {
        loadingSearchModpacks.value = false
        errorMessage2.value = t('search.network-error')
        showError2.value = true
      })
    })
  })
}

</script>

<style scoped>

</style>