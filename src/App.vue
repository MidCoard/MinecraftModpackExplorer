<script setup>
import FLink from '@/components/FLink.vue'
import i18n from "@/i18n";
import {ref, watch} from "vue";

let locale = ref(i18n.global.locale.value)

watch(locale, (newLocale) => {
  localStorage.setItem('locale', newLocale)
  i18n.global.locale.value = newLocale
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

</script>

<template>
  <b-container fluid>
    <hr class="my-3 invisible"/>
    <b-row class="justify-content-center">
      <b-col cols="12" md="6" sm="7">
        <b-row>
          <b-col cols="auto">
            <b-form-select class="float-end" v-model="locale" :options="locales" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <router-view />
    <b-row class="justify-content-center">
      <b-col cols="12" md="6" sm="7">
        <hr/>
        <h6 style="display: inline"><f-link class="float-start" href="https://focess.top">MidCoard' Home</f-link></h6>
        <h6 style="display: inline" class="float-end">Supported by <f-link class="api-name" href="https://api.focess.top">FocessAPI</f-link></h6>
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
