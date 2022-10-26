<script setup>
import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useConstants} from "@/stores/useConstants";
import axios from "axios";

const groupSize = 3;

const {t} = useI18n()
const constants = useConstants()
let keyword = ref('')
let loadingSearch =  ref(false)
let showError =  ref(false)
let errorMessage = ref('')
let mods = ref([])
let timeoutId;

let searchCount = ref(0)

let selectedMods = ref([])
let selectedModsGroupSize = computed(()=>parseInt(selectedMods.value.length % groupSize === 0 ? selectedMods.value.length / groupSize :selectedMods.value.length /groupSize + 1) )

function search() {
  if (keyword.value === '')
    return
  loadingSearch.value = true
  showError.value = false
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    grecaptcha.ready(function () {
      grecaptcha.execute('6LdQjSYiAAAAAG9rVoUJxVajIae3snOj9J1f6iOd', {action: 'search_mods'}).then(function (token) {
        searchCount.value++
        axios.post(`${constants.apiUrl}v1/focessapi/minecraft/mod/search`,{
          keyword: keyword.value.trim(),
          recaptcha: token,
          sortType: 4,
          sortBy: 1
        }).then(res => {
          mods.value = res.data
          loadingSearch.value = false
          if (mods.value.length === 0) {
            errorMessage.value = t('search.not-found-error')
            showError.value = true
          }
          searchCount.value--
        }).catch(() => {
          loadingSearch.value = false
          errorMessage.value = t('search.network-error')
          showError.value = true
          searchCount.value--
        })
      })
    })
  }, 500)
}

</script>

<template>
  <b-container fluid>
    <b-row class="justify-content-center">
      <b-col cols="12" sm="7">
        <h1 class="mt-3">{{$t('home.title')}}</h1>
        <h6 class="">{{$t('home.description')}}</h6>
        <b-input-group class="mt-3">
          <b-form-input v-model="keyword" @input="search" :placeholder="$t('search.placeholder')" />
        </b-input-group>
        <div v-show="showError">
          <b-alert show variant="danger" class="mt-3">
            {{errorMessage}}
          </b-alert>
        </div>
        <div v-if="(loadingSearch && !showError) || searchCount !== 0" class="d-flex align-items-center">
          <b-spinner class="mt-3" type="grow" variant="secondary" style="margin: auto;" />
        </div>
        <b-list-group v-show="searchCount === 0 && !showError && !loadingSearch && mods.length !== 0 && keyword.length !== 0" style="overflow: scroll;max-height: 400px;box-shadow: black">
          <b-list-group-item v-show="!selectedMods.map(m=>m.id).includes(mod.id)" @click="selectedMods.push(mod);keyword = ''" class="mod-item" v-for="mod in mods.filter(m=>m.status !== 9)" :key="mod.name"><b-img :src="`${constants.apiUrl}v1/focessapi/minecraft/mod/avatar/` + mod.id" height="30px" width="auto"/> {{mod.name}} <span class="float-end text-secondary" v-show="mod.authors.length !== 0">{{$t('home.create-by')}} {{mod.authors.length !== 0 ? mod.authors[0].name : ''}}</span></b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <b-row class="justify-content-center">
      <b-col cols="12" sm="7">
        <b-card-group deck v-for="index of selectedModsGroupSize" class="mt-3"
                      :key="index">
          <b-row style="width: 100%">
            <b-col cols="4" v-for="(mod,i) in selectedMods.slice((index-1) * groupSize, Math.min(index*groupSize, selectedMods.length))" :key="mod.name">
              <b-card :title="mod.name" title-tag="h6" class="single-mod">
                <svg @click="selectedMods.splice(i,1)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg single-mod-close pointer" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
                <b-img height="64px" width="auto" :src="`${constants.apiUrl}v1/focessapi/minecraft/mod/avatar/` + mod.id"></b-img>
                <b-card-text v-show="mod.authors.length !== 0" class="text-secondary">{{$t('home.create-by')}} {{mod.authors.length !== 0 ? mod.authors[0].name : ''}}</b-card-text>
              </b-card>
            </b-col>
          </b-row>
        </b-card-group>
      </b-col>
    </b-row>
    <b-row class="justify-content-center">
      <b-col cols="auto">
        <b-button class="mt-3" variant="secondary" size="lg" :disabled="selectedMods.length === 0" @click="$router.push({name: 'search',params:{ids:JSON.stringify(selectedMods.map(m=>m.id))}})">{{$t('home.search')}}</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<style scoped>

.pointer {
  cursor: pointer;
}
.mod-item {
  cursor: pointer;
}
.mod-item:hover {
  background: deepskyblue;
}

.single-mod {
  max-height: 100px;
  overflow: scroll;
}

.single-mod-close {
  position: absolute;
  top: 5px;
  right: 5px;
}

</style>
