<template>
  <div class="demo-section">
    <h2>Checkboxes</h2>
    <p>Demonstrates checkbox functionality with different modes and behaviors.</p>

    <div class="examples">
      <div class="example">
        <h3>Basic Checkboxes</h3>
        <p>Simple checkbox functionality with check/uncheck behavior.</p>
        <div class="tree-container">
          <tree :data="treeData1" :options="treeOptions1" />
        </div>
      </div>

      <div class="example">
        <h3>Tri-state Checkboxes</h3>
        <p>Checkboxes with tri-state behavior (checked, unchecked, indeterminate).</p>
        <div class="tree-container">
          <tree :data="treeData2" :options="treeOptions2" />
        </div>
      </div>

      <div class="example">
        <h3>Custom Checkbox Behavior</h3>
        <p>Checkboxes with custom behavior and events.</p>
        <div class="controls">
          <button @click="checkAll" class="control-button">Check All</button>
          <button @click="uncheckAll" class="control-button">Uncheck All</button>
          <button @click="getChecked" class="control-button">Get Checked</button>
        </div>
        <div v-if="checkedNodes.length" class="checked-info">
          <strong>Checked nodes:</strong> {{ checkedNodes.map(n => n.text).join(', ') }}
        </div>
        <div class="tree-container">
          <tree 
            ref="checkboxTree"
            :data="treeData3" 
            :options="treeOptions3"
            @node:checked="onNodeChecked"
            @node:unchecked="onNodeUnchecked"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Checkboxes',
  data() {
    return {
      checkedNodes: [],
      
      treeData1: [
        { 
          text: 'Parent 1',
          children: [
            { text: 'Child 1.1', state: { checked: true } },
            { text: 'Child 1.2' },
            { text: 'Child 1.3' }
          ]
        },
        { 
          text: 'Parent 2',
          state: { checked: true },
          children: [
            { text: 'Child 2.1' },
            { text: 'Child 2.2' }
          ]
        },
        { text: 'Parent 3' }
      ],

      treeOptions1: {
        checkbox: true,
        checkOnSelect: true
      },

      treeData2: [
        { 
          text: 'Documents',
          state: { expanded: true },
          children: [
            { 
              text: 'Work',
              children: [
                { text: 'Report.pdf', state: { checked: true } },
                { text: 'Presentation.pptx' },
                { text: 'Spreadsheet.xlsx', state: { checked: true } }
              ]
            },
            { 
              text: 'Personal',
              children: [
                { text: 'Photos' },
                { text: 'Videos' }
              ]
            }
          ]
        },
        { 
          text: 'Downloads',
          children: [
            { text: 'Software.zip' },
            { text: 'Music.mp3', state: { checked: true } }
          ]
        }
      ],

      treeOptions2: {
        checkbox: true,
        autoCheckChildren: true,
        checkOnSelect: false
      },

      treeData3: [
        { 
          text: 'Features',
          state: { expanded: true },
          children: [
            { text: 'Authentication' },
            { text: 'User Management' },
            { text: 'File Upload' },
            { text: 'Search' }
          ]
        },
        { 
          text: 'Modules',
          state: { expanded: true },
          children: [
            { text: 'Dashboard' },
            { text: 'Reports' },
            { text: 'Settings' }
          ]
        }
      ],

      treeOptions3: {
        checkbox: true,
        multiple: true
      }
    }
  },

  methods: {
    checkAll() {
      if (this.$refs.checkboxTree) {
        this.$refs.checkboxTree.checkAll()
      }
    },

    uncheckAll() {
      if (this.$refs.checkboxTree) {
        this.$refs.checkboxTree.uncheckAll()
      }
    },

    getChecked() {
      if (this.$refs.checkboxTree) {
        this.checkedNodes = this.$refs.checkboxTree.checked()
      }
    },

    onNodeChecked(node) {
      console.log('Node checked:', node.text)
    },

    onNodeUnchecked(node) {
      console.log('Node unchecked:', node.text)
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
}

.controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.control-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.control-button:hover {
  background: #5a67d8;
}

.checked-info {
  background: #e6fffa;
  border: 1px solid #38d9a9;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  color: #065f46;
}
</style>