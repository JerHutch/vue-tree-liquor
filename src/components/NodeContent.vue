<script setup>
import { ref, nextTick, useSlots, watchEffect } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})

const editCtrl = ref(null)
const slots = useSlots()
const nodeText = ref('')

// Component name can be set with defineOptions
defineOptions({
  name: 'NodeContent'
})

// Using watchEffect instead of watch
watchEffect(() => {
  if (props.node.isEditing) {
    nodeText.value = props.node.text
    nextTick(() => {
      editCtrl.value && editCtrl.value.focus()
    })
  }
})
</script>

<template>
  <input
    v-if="node.isEditing"
    ref="editCtrl"
    :value="node.text"
    type="text"
    class="tree-input"
    @input="e => nodeText = e.target.value"
    @blur="node.stopEditing(nodeText)"
    @keyup.enter="node.stopEditing(nodeText)"
    @mouseup.stop
  />

  <component
    v-else-if="$slots.default"
    :is="$slots.default"
    :node="node"
  />

  <span
    v-else
    v-html="node.text"
  />
</template>
