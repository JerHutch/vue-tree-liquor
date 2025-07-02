<template>
  <div class="demo-section">
    <h2>Async Data</h2>
    <p>Demonstrates loading tree data asynchronously and lazy loading.</p>

    <div class="examples">
      <div class="example">
        <h3>Promise-based Data Loading</h3>
        <p>Load tree data from a Promise with loading indicator.</p>
        <button @click="loadAsyncData" class="load-button" :disabled="loading1">{{ loading1 ? 'Loading...' : 'Load Async Data' }}</button>
        <div class="tree-container">
          <tree v-if="asyncData1" :data="asyncData1" :options="treeOptions" />
          <div v-else-if="loading1" class="loading-indicator">Loading tree data...</div>
        </div>
      </div>

      <div class="example">
        <h3>Lazy Loading Children</h3>
        <p>Load child nodes on demand when parent is expanded.</p>
        <div class="tree-container">
          <tree :data="lazyData" :options="lazyOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AsyncData',
  data() {
    return {
      loading1: false,
      asyncData1: null,
      
      treeOptions: {
        multiple: true,
        checkbox: true
      },

      lazyData: [
        {
          text: 'Lazy Parent 1',
          isBatch: true,
          children: this.loadLazyChildren
        },
        {
          text: 'Lazy Parent 2', 
          isBatch: true,
          children: this.loadLazyChildren
        }
      ],

      lazyOptions: {
        multiple: false
      }
    }
  },

  methods: {
    loadAsyncData() {
      this.loading1 = true
      this.asyncData1 = null
      
      // Simulate API call
      setTimeout(() => {
        this.asyncData1 = [
          {
            text: 'API Data Root 1',
            state: { expanded: true },
            children: [
              { text: 'API Child 1.1', state: { checked: true } },
              { text: 'API Child 1.2' },
              { 
                text: 'API Child 1.3',
                children: [
                  { text: 'API Grandchild 1.3.1' },
                  { text: 'API Grandchild 1.3.2' }
                ]
              }
            ]
          },
          {
            text: 'API Data Root 2',
            children: [
              { text: 'API Child 2.1' },
              { text: 'API Child 2.2' }
            ]
          },
          {
            text: 'API Data Root 3'
          }
        ]
        this.loading1 = false
      }, 2000)
    },

    loadLazyChildren(node, resolve, reject) {
      // Simulate async loading of children
      setTimeout(() => {
        const children = [
          { text: `${node.text} - Child 1` },
          { text: `${node.text} - Child 2` },
          { 
            text: `${node.text} - Lazy Child`,
            isBatch: true,
            children: this.loadLazyChildren
          }
        ]
        resolve(children)
      }, 1500)
    }
  }
}
</script>

<style scoped>
.demo-section {
  max-width: 800px;
}

.demo-section h2 {
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.demo-section > p {
  color: #718096;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.examples {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.example {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.example h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.example > p {
  color: #718096;
  margin-bottom: 1rem;
}

.tree-container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  background: #f8fafc;
  min-height: 200px;
  margin-top: 1rem;
}

.load-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.load-button:hover:not(:disabled) {
  background: #5a67d8;
}

.load-button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #718096;
  font-style: italic;
}
</style>