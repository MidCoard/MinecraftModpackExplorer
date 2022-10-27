<template>
  <b-container fluid>
    <b-row class="justify-content-center mt-3">
      <b-col cols="12" sm="7">
        <h2 style="display: inline">{{$t('search.title')}}</h2>
        <span class="float-end">
          <b-button @click="$router.push({name: 'home'})">{{$t('search.back')}}</b-button>
        </span>
      </b-col>
    </b-row>
    <b-row class="justify-content-center mt-3">
      <b-col cols="auto">
        <b-input-group>
          <b-input-group-prepend>
            <b-input-group-text>
              {{$t('search.according-to')}}
            </b-input-group-text>
          </b-input-group-prepend>
          <b-form-select @input="update" v-model="sortType" :options="sortTypeOptions" :disabled="loadingSearchModpacks"></b-form-select>
          <b-form-select @input="update" v-model="sortBy" :options="sortByOptions" :disabled="loadingSearchModpacks"></b-form-select>
          <b-input-group-append>
            <b-input-group-text>
              {{$t('search.sort')}}
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row v-show="!showError" class="justify-content-center">
      <b-col cols="12" sm="7">
        <b-card-group v-for="index of modpacksGroupSize" class="mt-3"
                      :key="index">
        <b-row style="width: 100%">
            <b-col :cols="12/groupSize" v-for="(mod) in modpacks.slice((index-1) * groupSize, Math.min(index*groupSize, modpacks.length))" :key="mod.name">
              <b-card class="single-mod pointer" :title="mod.name" title-tag="h6" @click="goUrl(mod.url)">
                <b-img rounded height="64px" width="auto" :src="`${constants.apiUrl}v1/focessapi/minecraft/mod/avatar/` + mod.id"></b-img>
                <b-card-text class="text-secondary mb-0">
                  <p v-show="mod.authors.length !== 0" class="mb-0">
                  {{$t('home.create-by')}} {{mod.authors.length !== 0 ? mod.authors[0].name : ''}}
                  </p>
                  <p class="mb-0" v-show="mod.latestGameVersions.length !== 0">
                    {{$t('home.latest-game-version')}}
                    <span v-for="gameVersion in mod.latestGameVersions">
                      {{gameVersion.name}} &nbsp;
                    </span>
                  </p>
                  <p class="mb-0">
                    {{$t('home.mods-count')}} {{mod.dependencies.length}}
                  </p>
                  <p class="mb-0">
                    {{$t('home.download-count')}} {{mod.downloadCount}}
                  </p>
                  <p class="mb-0">
                    {{$t('home.create-time')}} {{new Date(mod.createTime).toLocaleString()}}
                  </p>
                  <p class="mb-0">
                    {{$t('home.modify-time')}} {{new Date(mod.modifyTime).toLocaleString()}}
                  </p>
                </b-card-text>
              </b-card>
            </b-col>
        </b-row>
        </b-card-group>
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
import axios from "axios";
import {computed, inject, onMounted, onUnmounted, ref, watch} from "vue";
import {useConstants} from "@/stores/useConstants";
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";

const constants = useConstants()

const {t} = useI18n()

const groupSize = 3

const route = useRoute()

let sortType = ref(localStorage.getItem('sortType') || 4)
let sortBy = ref(localStorage.getItem('sortBy') || 1)

watch(sortType, (newVal) => {
  localStorage.setItem('sortType', newVal)
})

watch(sortBy, (newVal) => {
  localStorage.setItem('sortBy', newVal)
})

let noModpacks = ref(false)

let sortByOptions = ref(
    [
      {
        value: 0,
        text: t('search.sort-by.asc')
      },
      {
        value: 1,
        text: t('search.sort-by.desc')
      }
    ]
)

let sortTypeOptions = ref(
    [
      {
        value: 0,
        text: t('search.sort-type.id')
      },
      {
        value: 1,
        text: t('search.sort-type.name')
      },
      {
        value: 2,
        text: t('search.sort-type.create-time')
      },
      {
        value: 3,
        text: t('search.sort-type.modify-time')
      },
      {
        value: 4,
        text: t('search.sort-type.download-count')
      }
    ]
)


let scrollValue = ref(window.scrollY);

const scrollListener = () => {
  scrollValue.value = window.scrollY;
}

onMounted(()=>{
  window.addEventListener('scroll', scrollListener)
})

onUnmounted(()=>{
  window.removeEventListener('scroll', scrollListener)
})

watch(scrollValue, (value) => {
  if (!noModpacks.value && !loadingSearchModpacks.value && value + 1000 > document.body.scrollHeight) {
    searchModpacks()
  }
})

let errorMessage = ref('')
let showError =  ref(false)
let loadingSearchModpacks = ref(false)
let modpacks = ref([])
let modpacksGroupSize = computed(()=>parseInt(modpacks.value.length % groupSize === 0 ? modpacks.value.length / groupSize :modpacks.value.length /groupSize + 1) )

onMounted(() => {
  searchModpacks()
})

let locale = inject('locale')

watch(locale, (newLocale)=>{
  sortByOptions.value =
      [
        {
          value: 0,
          text: t('search.sort-by.asc')
        },
        {
          value: 1,
          text: t('search.sort-by.desc')
        }
      ]

  sortTypeOptions.value =
      [
        {
          value: 0,
          text: t('search.sort-type.id')
        },
        {
          value: 1,
          text: t('search.sort-type.name')
        },
        {
          value: 2,
          text: t('search.sort-type.create-time')
        },
        {
          value: 3,
          text: t('search.sort-type.modify-time')
        },
        {
          value: 4,
          text: t('search.sort-type.download-count')
        }
      ]
})

function update() {
  if (!loadingSearchModpacks.value) {
    console.log("????")
      modpacks.value.splice(0, modpacks.value.length)
      searchModpacks()
  }
}

function searchModpacks() {
  loadingSearchModpacks.value = true
  showError.value = false
  grecaptcha.ready(function () {
    grecaptcha.execute('6LdQjSYiAAAAAG9rVoUJxVajIae3snOj9J1f6iOd', {action: 'search_modpacks'}).then(function (token) {
      axios.post(`${constants.apiUrl}v1/focessapi/minecraft/modpack/depend`,{
        ids: JSON.parse(route.params.ids),
        recaptcha: token,
        sortType: sortType.value,
        sortBy: sortBy.value,
        pagination: {
          index: modpacks.value.length
        }
      }).then(res => {
        if (res.data.length < 50)
          noModpacks.value = true
        modpacks.value.push(...res.data)
        if (modpacks.value.length === 0) {
          errorMessage.value = t('search.not-found-error')
          showError.value = true
        }
        loadingSearchModpacks.value = false
      }).catch(() => {
        loadingSearchModpacks.value = false
        errorMessage.value = t('search.network-error')
        showError.value = true
      })
    })
  })
}

function goUrl(url) {
  window.open(url)
}

</script>

<style scoped>
.single-mod {
  max-height: 275px;
  height: 275px;
  overflow: scroll;
  box-shadow: gray 0 0 2px;
  transition: box-shadow 0.3s;
}

.single-mod:hover {
  box-shadow: gray 0 0 5px;
  transition: box-shadow 0.3s;
}

.pointer {
  cursor: pointer;
}
</style>