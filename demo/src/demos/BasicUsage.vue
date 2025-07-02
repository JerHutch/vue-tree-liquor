<template>
  <div class="demo-section">
    <h2>Basic Usage</h2>
    <p>Demonstrates the basic functionality of the Liquor Tree component.</p>

    <div class="examples">
      <div class="example">
        <h3>Simple Tree with v-model</h3>
        <p>Tree behaviour by default. Without any states. Tree allows to have more than 1 root node.</p>
        <p v-if="selectedNode0 && selectedNode0.length">
          Selected nodes: <strong>{{ selectedNode0.map(s => s.text).join(', ') }}</strong>
        </p>
        <div class="tree-container">
          <tree :data="treeData0" v-model="selectedNode0" />
        </div>
      </div>

      <div class="example">
        <h3>Tree with Options and States</h3>
        <p>Here we defined some states for Nodes and added tree options.</p>
        <div class="tree-container">
          <tree :data="treeData1" :options="treeOptions1"/>
        </div>
      </div>

      <div class="example">
        <h3>Async Data Loading</h3>
        <p>Init data can be either Array or Promise object.</p>
        <div class="tree-container">
          <button @click="initTree2" v-if="!treeData2" class="load-button">Build Tree</button>
          <tree v-if="treeData2" :data="treeData2" />
        </div>
      </div>

      <div class="example">
        <h3>Custom Property Names</h3>
        <p>Overriding default structure of tree data</p>
        <div class="tree-container">
          <tree :data="treeData3" :options="treeOptions3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicUsage',
  data() {
    return {
      selectedNode0: null,
      treeData0: [
        { text: 'Item 1' },
        { text: 'Item 2', children: [
          { text: 'Item 2.1' },
          { text: 'Item 2.2' },
          { text: 'Item 2.3' }
        ]},
        { text: 'Item 3' },
        { text: 'Item 4' },
        { text: 'Item 5' },
      ],

      treeData1: [{
        text: 'Item 1',
        state: {
          selected: true
        }
      }, {
        text: 'Item 2',
        state: {
          expanded: true
        },
        children: [{
          text: '<b>Item 2.1</b>',
          state: {
            checked: true
          }
        }, {
          text: 'Item 2.2'
        }, {
          text: 'Item 2.3',
          children: [{
            text: 'Item 2.3.1'
          }, {
            text: 'Item 2.3.2'
          }, {
            text: 'Item 2.3.3'
          }, {
            text: 'Item 2.3.4',
            children: [{
              text: 'Item 2.3.4.1'
            }, {
              text: 'Item 2.3.4.2'
            }]
          }]
        }, {
          text: 'Item 2.4'
        }]
      }, {
        text: 'Item 3',
        state: {
          selected: true
        }
      }, {
        text: 'Item 4'
      }, {
        text: 'Item 5',
        state: {
          expanded: true,
          disabled: true
        },
        children: [{
          text: 'Item 5.1'
        }, {
          text: 'Item 5.2'
        }, {
          text: 'Item 5.3'
        }]
      }],

      treeOptions1: {
        multiple: false,
        keyboardNavigation: false,
        parentSelect: true
      },

      treeData2: null,

      treeData3: [{
        MY_TEXT: 'JS: The Right Way',
        OPTIONS: { expanded: true },
        KIDS: [
          { MY_TEXT: 'Getting Started', OPTIONS: { checked: true } },
          { MY_TEXT: 'JavaScript Code Style', OPTIONS: { selected: true } },
          { MY_TEXT: 'The Good Parts', KIDS: [
            { MY_TEXT: 'OBJECT ORIENTED', OPTIONS: { checked: true }  },
            { MY_TEXT: 'ANONYMOUS FUNCTIONS', OPTIONS: { checked: true }  },
            { MY_TEXT: 'FUNCTIONS AS FIRST-CLASS OBJECTS', OPTIONS: { checked: true }  },
            { MY_TEXT: 'LOOSE TYPING', OPTIONS: { checked: true }  }
          ]},
          { MY_TEXT: 'Patterns', KIDS: [
            { MY_TEXT: 'DESIGN PATTERNS', OPTIONS: { expanded: true }, KIDS: [
              { MY_TEXT: 'Creational Design Patterns', KIDS: [
                { MY_TEXT: 'Factory' },
                { MY_TEXT: 'Prototype' },
                { MY_TEXT: 'Mixin' },
                { MY_TEXT: 'Singleton' }
              ]},
              { MY_TEXT: 'Structural Design Patterns'}
            ]},
            { MY_TEXT: 'MV* PATTERNS', KIDS: [
              { MY_TEXT: 'MVC Pattern' },
              { MY_TEXT: 'MVP Pattern' },
              { MY_TEXT: 'MVVM Pattern' }
            ]}
          ]}
        ]
      }],

      treeOptions3: {
        propertyNames: {
          text: 'MY_TEXT',
          children: 'KIDS',
          state: 'OPTIONS'
        },
        deletion: true
      }
    }
  },
  methods: {
    initTree2() {
      this.treeData2 = new Promise(resolve => {
        setTimeout(() => resolve(this.getAsyncTreeData()), 2600)
      })

      this.treeData2.then(data => {
        data[0].state = {}
      })
    },

    getAsyncTreeData() {
      return [{
        text: 'Loaded Item 1',
        state: { selected: true }
      }, {
        text: 'Loaded Item 2',
        state: { expanded: true },
        children: [{
          text: 'Loaded Item 2.1',
          state: { checked: true }
        }, {
          text: 'Loaded Item 2.2'
        }, {
          text: 'Loaded Item 2.3'
        }]
      }, {
        text: 'Loaded Item 3'
      }]
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

.load-button:hover {
  background: #5a67d8;
}
</style>