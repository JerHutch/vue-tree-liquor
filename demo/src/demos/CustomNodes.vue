<template>
  <div class="demo-section">
    <h2>Custom Nodes</h2>
    <p>Demonstrates custom node rendering and icons.</p>

    <div class="examples">
      <div class="example">
        <h3>Custom Node Content</h3>
        <p>Custom node rendering with icons and badges.</p>
        <div class="tree-container">
          <tree :data="customData" :options="customOptions">
            <template #default="{ node }">
              <div class="custom-node">
                <span class="node-icon">{{ getIcon(node) }}</span>
                <span class="node-text">{{ node.text }}</span>
                <span v-if="node.data.badge" class="node-badge">{{ node.data.badge }}</span>
                <span v-if="node.data.status" :class="`node-status node-status-${node.data.status}`">{{ node.data.status }}</span>
              </div>
            </template>
          </tree>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomNodes',
  data() {
    return {
      customData: [
        {
          text: 'Project Root',
          data: { type: 'folder', badge: 'v1.0' },
          state: { expanded: true },
          children: [
            {
              text: 'src',
              data: { type: 'folder' },
              children: [
                { text: 'main.js', data: { type: 'javascript', status: 'modified' } },
                { text: 'App.vue', data: { type: 'vue', status: 'clean' } },
                { text: 'style.css', data: { type: 'css' } }
              ]
            },
            {
              text: 'tests',
              data: { type: 'folder', badge: '12' },
              children: [
                { text: 'unit.test.js', data: { type: 'test', status: 'passing' } },
                { text: 'e2e.test.js', data: { type: 'test', status: 'failing' } }
              ]
            },
            { text: 'package.json', data: { type: 'json' } },
            { text: 'README.md', data: { type: 'markdown' } }
          ]
        },
        {
          text: 'Documentation',
          data: { type: 'folder', badge: 'docs' },
          children: [
            { text: 'API.md', data: { type: 'markdown' } },
            { text: 'Guide.md', data: { type: 'markdown' } }
          ]
        }
      ],
      
      customOptions: {
        multiple: false
      }
    }
  },

  methods: {
    getIcon(node) {
      const type = node.data?.type || 'file'
      const icons = {
        folder: '📁',
        javascript: '🟨',
        vue: '💚',
        css: '🎨',
        json: '📋',
        markdown: '📝',
        test: '🧪',
        file: '📄'
      }
      return icons[type] || icons.file
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
  min-height: 300px;
}

.custom-node {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.node-icon {
  font-size: 1rem;
}

.node-text {
  flex: 1;
  color: #2d3748;
  font-weight: 500;
}

.node-badge {
  background: #667eea;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.node-status {
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-weight: 500;
  text-transform: uppercase;
}

.node-status-clean {
  background: #c6f6d5;
  color: #22543d;
}

.node-status-modified {
  background: #fef5e7;
  color: #744210;
}

.node-status-passing {
  background: #c6f6d5;
  color: #22543d;
}

.node-status-failing {
  background: #fed7d7;
  color: #742a2a;
}
</style>