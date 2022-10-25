import {createI18n} from "vue-i18n";
import zh_CN from '../assets/langs/zh_CN.json'
import en_US from '../assets/langs/en_US.json'


const messages = {zh_CN, en_US}

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem("language") || "zh_CN",
    fallbackLocale: 'zh_CN',
    messages
})

export default i18n