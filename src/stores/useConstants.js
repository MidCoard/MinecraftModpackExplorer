import {acceptHMRUpdate, defineStore} from 'pinia'

export const useConstants = defineStore({
    id: 'constants',
    state: () => ({
        // url: 'http://localhost:8082/',
        url: 'https://api.focess.top/',
        locale: localStorage.getItem("locale") || "zh_CN",
    }),
    getters: {
        apiUrl(state) {
            return state.url;
        },
        locale(state) {
            return state.locale;
        }
    },
    actions: {
        updateLocale(locale) {
            this.locale = locale
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useConstants, import.meta.hot))
}

