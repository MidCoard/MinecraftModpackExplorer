<template>
  <b-container fluid>
    <b-row class="justify-content-center">
      <b-col cols="12" md="6" sm="7">
        <h2>{{$t('search.title')}}</h2>
      </b-col>
    </b-row>
    <b-row v-show="loadingSearchModpacks" class="justify-content-center">
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
    <b-row v-show="!showError2 && !loadingSearchModpacks" class="justify-content-center">
      <b-col cols="12" md="6" sm="7">
        <b-card-group v-for="index of modpacksGroupSize" class="mt-3"
                      :key="index">
        <b-row style="width: 100%">
            <b-col cols="4" v-for="mod in modpacks.slice((index-1) * groupSize, Math.min(index*groupSize, modpacks.length))" :key="mod.name">
              <b-card class="single-mod" :title="mod.name" title-tag="h6">
                <b-img height="64px" width="auto" :src="`${constants.apiUrl}v1/focessapi/minecraft/mod/avatar/` + mod.id"></b-img>
                <b-card-text v-show="mod.authors.length !== 0" class="text-secondary">{{$t('home.create-by')}} {{mod.authors.length !== 0 ? mod.authors[0].name : ''}}</b-card-text>
              </b-card>
            </b-col>
        </b-row>
        </b-card-group>
      </b-col>
    </b-row>
    <b-row v-show="showError2" class="justify-content-center">
      <b-col cols="12" md="6" sm="7">
        <b-alert show variant="danger" class="mt-3">
          {{errorMessage2}}
        </b-alert>
      </b-col>
    </b-row>
  </b-container>
</template>

<script setup>
import axios from "axios";
import {computed, onMounted, ref} from "vue";
import {useConstants} from "@/stores/useConstants";
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";

const constants = useConstants()

const {t} = useI18n()

const groupSize = 3

const route = useRoute()

let errorMessage2 = ref('')
let showError2 =  ref(false)
let loadingSearchModpacks = ref(false)
let modpacks = ref([])
let modpacksGroupSize = computed(()=>parseInt(modpacks.value.length % groupSize === 0 ? modpacks.value.length / groupSize :modpacks.value.length /groupSize + 1) )

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
        if (res.data.length === 0) {
          errorMessage2.value = t('search.not-found-error')
          showError2.value = true
        }
        modpacks.value = res.data
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
.single-mod {
  max-height: 200px;
  height: 200px;
  overflow: scroll;
}
</style>