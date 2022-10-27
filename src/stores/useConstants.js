import {acceptHMRUpdate, defineStore} from 'pinia'
import {ref} from "vue";

export const useConstants = defineStore({
    id: 'constants',
    state: () => ({
        // url: 'http://localhost:8082/',
        url: 'https://api.focess.top/'
    }),
    getters: {
        apiUrl(state) {
            return state.url;
        },
        locale(state) {
            return state.locale;
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useConstants, import.meta.hot))
}

