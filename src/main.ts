import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
// 你自定义的 css
import './styles/main.scss'

import 'virtual:windi-devtools'
import 'virtual:windi-utilities.css'

import 'element-plus/theme-chalk/src/badge.scss'
import 'element-plus/theme-chalk/src/message-box.scss'
import 'element-plus/theme-chalk/src/message.scss'

import directives from '~/modules/directives'
import i18n from '~/modules/i18n'
import pinia from '~/modules/pinia'
import vueRouter from '~/modules/router'

import App from './App.vue'

createApp(App).use(pinia).use(vueRouter).use(i18n).use(directives).mount('#app')
