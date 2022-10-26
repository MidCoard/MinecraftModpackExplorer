<script setup>
import FLink from '@/components/FLink.vue'
import {reactive, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useConstants} from "@/stores/useConstants";
import axios from "axios";

const {t} = useI18n()
const constants = useConstants()
let keyword = ref('')

let timeoutId;

function search() {
  if (keyword.value === '')
    return
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    grecaptcha.ready(function () {
      grecaptcha.execute('6LdQjSYiAAAAAG9rVoUJxVajIae3snOj9J1f6iOd', {action: 'search_mod'}).then(function (token) {
        axios.post(`${constants.apiUrl}v1/focessapi/minecraft/mod/search`,{
          keyword: keyword.value,
          recaptcha: token,
          sortType: 4,
          sortBy: 1
        }).then(res => {
          let result = res.data
          console.log(result)
        })
      })
    })
  }, 300)
}

</script>

<template>
  <b-container fluid>
    <b-row class="justify-content-center">
      <b-col cols="12" md="6" sm="7">
        <h1 class="mt-3">{{$t('home.title')}}</h1>
        <h6 class="">{{$t('home.description')}}</h6>
        <b-input-group class="mt-3">
          <b-form-input v-model="keyword" @input="search" :placeholder="$t('search.placeholder')" />
        </b-input-group>
      </b-col>
    </b-row>
  </b-container>
</template>
