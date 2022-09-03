import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import VueClipboard from 'vue-clipboard2'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(VueClipboard)

Vue.config.productionTip = false

// 动态设置标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    if (typeof to.meta.title === 'function') {
      document.title = to.meta.title(to.query)
    } else {
      document.title = to.meta.title
    }
  }
  next()
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
