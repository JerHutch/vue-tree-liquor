<template>
  <div class="demo-section">
    <h2>Events</h2>
    <p>Demonstrates various events that can be triggered by tree interactions.</p>

    <div class="examples">
      <div class="example">
        <h3>Tree Events</h3>
        <p>Click, select, expand/collapse, and other tree events.</p>
        
        <div class="event-log">
          <h4>Event Log:</h4>
          <div class="log-container">
            <div 
              v-for="(event, index) in eventLog" 
              :key="index"
              class="log-entry"
            >
              <span class="log-time">{{ event.time }}</span>
              <span class="log-event">{{ event.event }}</span>
              <span class="log-node">{{ event.node }}</span>
            </div>
          </div>
          <button @click="clearLog" class="clear-button">Clear Log</button>
        </div>

        <div class="tree-container">
          <tree 
            :data="treeData" 
            :options="treeOptions"
            @node:clicked="onNodeClicked"
            @node:selected="onNodeSelected"
            @node:expanded="onNodeExpanded"
            @node:collapsed="onNodeCollapsed"
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
  name: 'Events',
  data() {
    return {
      eventLog: [],
      treeData: [
        { 
          text: 'Root Node 1',
          children: [
            { text: 'Child 1' },
            { text: 'Child 2' },
            { 
              text: 'Child 3',
              children: [
                { text: 'Grandchild 1' },
                { text: 'Grandchild 2' }
              ]
            }
          ]
        },
        { 
          text: 'Root Node 2',
          children: [
            { text: 'Child A' },
            { text: 'Child B' }
          ]
        }
      ],
      treeOptions: {
        checkbox: true,
        multiple: true
      }
    }
  },
  methods: {
    logEvent(eventName, node) {
      this.eventLog.unshift({
        time: new Date().toLocaleTimeString(),
        event: eventName,
        node: node.text
      })
      
      if (this.eventLog.length > 20) {
        this.eventLog = this.eventLog.slice(0, 20)
      }
    },

    onNodeClicked(node) {
      this.logEvent('clicked', node)
    },

    onNodeSelected(node) {
      this.logEvent('selected', node)
    },

    onNodeExpanded(node) {
      this.logEvent('expanded', node)
    },

    onNodeCollapsed(node) {
      this.logEvent('collapsed', node)
    },

    onNodeChecked(node) {
      this.logEvent('checked', node)
    },

    onNodeUnchecked(node) {
      this.logEvent('unchecked', node)
    },

    clearLog() {
      this.eventLog = []
    }
  }
}
</script>

<style scoped>
.demo-section {
  max-width: 1000px;
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

.event-log {
  margin-bottom: 1.5rem;
}

.event-log h4 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.log-container {
  background: #1a202c;
  border-radius: 8px;
  padding: 1rem;
  height: 200px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.log-entry {
  color: #e2e8f0;
  padding: 0.25rem 0;
  border-bottom: 1px solid #2d3748;
}

.log-time {
  color: #68d391;
  margin-right: 1rem;
}

.log-event {
  color: #63b3ed;
  margin-right: 1rem;
  font-weight: bold;
}

.log-node {
  color: #f7fafc;
}

.clear-button {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.clear-button:hover {
  background: #c53030;
}

.tree-container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  background: #f8fafc;
  min-height: 300px;
}
</style>