<script setup>
import { computed } from 'vue'

const props = defineProps({
  target: {
    type: Object,
    required: true
  }
})

const style = computed(() => {
  if (undefined === props.target.top) {
    return 'display: none'
  }

  return `top: ${props.target.top}px; left: ${props.target.left}px`
})

// Component name can be set with defineOptions if needed
defineOptions({
  name: 'DragNode'
})
</script>

<template>
  <div
    class="tree-dragnode"
    :style="style"
  >
    {{ target.node.text }}
  </div>
</template>

<style>
.tree-dragnode {
  padding: 10px;
  border: 1px solid #e7eef7;
  position: fixed;
  border-radius: 8px;
  background: #fff;
  transform: translate(-50%, -110%);
  z-index: 10;
}
</style>
