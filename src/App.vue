<script setup>
import FLink from '@/components/FLink.vue'
import i18n from "@/i18n";
import {ref, watch} from "vue";
import {useConstants} from "@/stores/useConstants";

const constants = useConstants()

let locale = ref(localStorage.getItem('locale') || 'zh_CN')

watch(locale, (newLocale) => {
  localStorage.setItem('locale', newLocale)
  i18n.global.locale.value = newLocale
  constants.updateLocale(newLocale)
})

let locales = [
  {
    value: 'en_US',
    text: 'English'
  },
  {
    value: 'zh_CN',
    text: '中文'
  }
]

function goFocessAPI(){
  window.open('https://api.focess.top')
}

</script>

<template>
  <b-container fluid>
    <hr class="my-3 invisible"/>
    <b-row class="justify-content-center">
      <b-col cols="12" sm="7">
        <b-row class="justify-content-end">
          <b-col cols="auto">
            <b-form-select v-model="locale" :options="locales" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <router-view />
    <b-row class="justify-content-center">
      <b-col cols="12" sm="7">
        <hr/>
        <h6 style="display: inline"><f-link class="float-start" href="https://focess.top">MidCoard' Home</f-link></h6>
        <h6 style="display: inline" class="float-end">Supported by <span class="api-name pointer" @click="goFocessAPI">FocessAPI</span></h6>
      </b-col>
    </b-row>
    <hr class="my-3 invisible"/>
  </b-container>
</template>

<style scoped>

.pointer {
  cursor: pointer;
}

.api-name {
  background: #9A68B3;
  background: linear-gradient(to top right, #9A68B3 0%, #FF0A1B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: IPix,PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif!important;
}
</style>
