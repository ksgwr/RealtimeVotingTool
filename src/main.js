import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

//window.location
axios.defaults.baseURL = 'http://localhost:3000';

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(VueAxios, axios)
  .mount('#app')