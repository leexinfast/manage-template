import Vue from 'vue'
import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss'// global css

import './icons' // icon

import App from './App'
import router from './router'
import store from './store'
import VueClipboard from 'vue-clipboard2'
// import Print from '@/utils/print'

import '@/permission'

// import 'viewerjs/dist/viewer.css'
// import Viewer from 'v-viewer'
// import BaiduMap from 'vue-baidu-map'
import filters from '@/utils/filters'

filters(Vue)

Vue.use(ElementUI);
// Vue.use(Viewer);
// Vue.use(Print)
// Vue.use(BaiduMap, {
//   ak: '7DyrfAyxpbD5qoIpFoKON0eEgqjmgix3'
// });
// Vue.use(VueClipboard);

Vue.config.productionTip = false;

// register global utility filters.
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
