<template>
  <div class="demo-section">
    <h2>Filtering</h2>
    <p>Demonstrates tree filtering functionality.</p>

    <div class="examples">
      <div class="example">
        <h3>Simple Text Filtering</h3>
        <p>Filter tree nodes by text content.</p>
        
        <div class="filter-controls">
          <input 
            v-model="filterText"
            type="text"
            placeholder="Filter nodes..."
            class="filter-input"
            @input="applyFilter"
          />
          <button @click="clearFilter" class="clear-button">Clear</button>
        </div>

        <div class="tree-container">
          <tree ref="filterTree" :data="treeData" :options="treeOptions" />
        </div>
      </div>

      <div class="example">
        <h3>Custom Filter Function</h3>
        <p>Filter by custom criteria (e.g., only show checked items).</p>
        
        <div class="filter-controls">
          <button @click="showOnlyChecked" class="filter-button">Show Only Checked</button>
          <button @click="showOnlyWithChildren" class="filter-button">Show Only Parents</button>
          <button @click="clearCustomFilter" class="clear-button">Show All</button>
        </div>

        <div class="tree-container">
          <tree ref="customFilterTree" :data="customTreeData" :options="customTreeOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Filtering',
  data() {
    return {
      filterText: '',
      
      treeData: [
        {
          text: 'Fruits',
          state: { expanded: true },
          children: [
            { text: 'Apple' },
            { text: 'Banana' },
            { text: 'Orange' },
            { text: 'Grape' }
          ]
        },
        {
          text: 'Vegetables',
          state: { expanded: true },
          children: [
            { text: 'Carrot' },
            { text: 'Broccoli' },
            { text: 'Spinach' },
            { text: 'Tomato' }
          ]
        },
        {
          text: 'Grains',
          children: [
            { text: 'Rice' },
            { text: 'Wheat' },
            { text: 'Oats' }
          ]
        }
      ],

      treeOptions: {
        filter: {
          emptyText: 'No matching nodes found'
        }
      },

      customTreeData: [
        {
          text: 'Development',
          state: { expanded: true, checked: true },
          children: [
            { text: 'Frontend', state: { checked: true } },
            { text: 'Backend' },
            { text: 'DevOps', state: { checked: true } }
          ]
        },
        {
          text: 'Design',
          state: { expanded: true },
          children: [
            { text: 'UI Design' },
            { text: 'UX Research', state: { checked: true } }
          ]
        },
        {
          text: 'Marketing',
          state: { checked: true }
        }
      ],

      customTreeOptions: {
        checkbox: true,
        filter: {
          emptyText: 'No nodes match the current filter'
        }
      }
    }
  },

  methods: {
    applyFilter() {
      if (this.$refs.filterTree) {
        this.$refs.filterTree.filter(this.filterText)
      }
    },

    clearFilter() {
      this.filterText = ''
      if (this.$refs.filterTree) {
        this.$refs.filterTree.filter('')
      }
    },

    showOnlyChecked() {
      if (this.$refs.customFilterTree) {
        this.$refs.customFilterTree.filter((node) => {
          return node.states.checked
        })
      }
    },

    showOnlyWithChildren() {
      if (this.$refs.customFilterTree) {
        this.$refs.customFilterTree.filter((node) => {
          return node.hasChildren()
        })
      }
    },

    clearCustomFilter() {
      if (this.$refs.customFilterTree) {
        this.$refs.customFilterTree.filter()
      }
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

.filter-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.filter-input {
  flex: 1;
  min-width: 200px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
}

.filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-button,
.clear-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.filter-button {
  background: #667eea;
  color: white;
}

.filter-button:hover {
  background: #5a67d8;
}

.clear-button {
  background: #e2e8f0;
  color: #4a5568;
}

.clear-button:hover {
  background: #cbd5e0;
}

.tree-container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  background: #f8fafc;
  min-height: 250px;
}
</style>