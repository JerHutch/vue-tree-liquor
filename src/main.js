import TreeRoot from './components/TreeRoot.vue'

// Vue 3 plugin installation function
const install = (app) => {
  app.component(TreeRoot.name || 'TreeRoot', TreeRoot)
}

// Create plugin object for Vue 3
export const LiquorTree = {
  install
}

// Auto-install when Vue is found in the global scope (browser usage)
let globalVue = null
if (typeof window !== 'undefined') {
  globalVue = window.Vue
}

if (globalVue) {
  globalVue.createApp({}).use(LiquorTree)
}

// Export the component itself to allow for destructuring
export { TreeRoot }

// Default export for backwards compatibility and Vue plugin
export default LiquorTree
