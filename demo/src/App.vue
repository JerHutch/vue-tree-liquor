<template>
  <div id="app">
    <header class="header">
      <h1>🌳 Liquor Tree Vue 3 Demo</h1>
      <p>Interactive demos with hot reload support</p>
    </header>

    <nav class="nav">
      <button 
        v-for="demo in demos" 
        :key="demo.key"
        @click="currentDemo = demo.key"
        :class="{ active: currentDemo === demo.key }"
        class="nav-button"
      >
        {{ demo.title }}
      </button>
    </nav>

    <main class="main">
      <component :is="currentDemoComponent" />
    </main>
  </div>
</template>

<script>
import BasicUsage from './demos/BasicUsage.vue'
import Checkboxes from './demos/Checkboxes.vue'
import Events from './demos/Events.vue'
import AsyncData from './demos/AsyncData.vue'
import CustomNodes from './demos/CustomNodes.vue'
import Filtering from './demos/Filtering.vue'

export default {
  name: 'App',
  components: {
    BasicUsage,
    Checkboxes,
    Events,
    AsyncData,
    CustomNodes,
    Filtering
  },
  data() {
    return {
      currentDemo: 'basic',
      demos: [
        { key: 'basic', title: 'Basic Usage', component: 'BasicUsage' },
        { key: 'checkboxes', title: 'Checkboxes', component: 'Checkboxes' },
        { key: 'events', title: 'Events', component: 'Events' },
        { key: 'async', title: 'Async Data', component: 'AsyncData' },
        { key: 'custom', title: 'Custom Nodes', component: 'CustomNodes' },
        { key: 'filtering', title: 'Filtering', component: 'Filtering' }
      ]
    }
  },
  computed: {
    currentDemoComponent() {
      const demo = this.demos.find(d => d.key === this.currentDemo)
      return demo ? demo.component : 'BasicUsage'
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f8fafc;
}

#app {
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.header p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.nav {
  background: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-button:hover {
  border-color: #667eea;
  color: #667eea;
}

.nav-button.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>