import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from '@/App.vue'
import PageHeader from '@/components/pages/PageHeader.vue'
import router from '@/router'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'

//window.location
axios.defaults.baseURL = window.location.origin;
//axios.defaults.baseURL = 'http://localhost:3000';
//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

loadFonts()

createApp(App)
  .component('PageHeader', PageHeader)
  .use(router)
  .use(vuetify)
  .use(VueAxios, axios)
  .mount('#app')
  