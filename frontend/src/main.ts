import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './assets/styles/tailwind.css'
import './assets/styles/global.css'
import oldIconfont from '../font_3vy41nisjyb/iconfont.js?raw'
import newIconfont from '../font_6a6ri7ajqgq/iconfont.js?raw'

// 合并两套 iconfont SVG symbols，避免互相覆盖
function mergeIconfonts() {
  const extractSymbols = (raw: string): string => {
    const m = raw.match(/'<svg>(.+?)<\/svg>'/)
    return m ? m[1] : ''
  }
  const allSymbols = extractSymbols(oldIconfont) + extractSymbols(newIconfont)
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('style', 'position: absolute; width: 0; height: 0; overflow: hidden')
  svg.innerHTML = allSymbols
  document.body.prepend(svg)
}

mergeIconfonts()

const app = createApp(App)
const pinia = createPinia()

// Register all Element Plus icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus, { size: 'default' })
app.mount('#app')
