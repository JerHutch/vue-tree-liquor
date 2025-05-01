import { ref, reactive } from 'vue'

const DropPosition = {
  ABOVE: 'drag-above',
  BELOW: 'drag-below',
  ON: 'drag-on'
}

function isMovingStarted(event, start) {
  return Math.abs(event.clientX - start[0]) > 5 || Math.abs(event.clientY - start[1]) > 5
}

function composedPath(event) {
  let el = event.target
  const path = []

  while (el) {
    path.push(el)

    if (el.tagName === 'HTML') {
      path.push(document)
      path.push(window)

      return path
    }

    el = el.parentElement
  }

  return path
}

function getPath(event) {
  if (event.path) {
    return event.path
  }

  if (event.composedPath) {
    return event.composedPath()
  }

  return composedPath(event)
}

function getSelectedNode(event) {
  let className
  let i = 0

  const path = getPath(event)

  for (; i < path.length; i++) {
    className = path[i].className || ''

    if (/tree-node/.test(className)) {
      return path[i]
    }
  }

  return null
}

function getDropDestination(e) {
  const selectedNode = getSelectedNode(e)

  if (!selectedNode) {
    return null
  }

  return selectedNode
}

function updateHelperClasses(target, classes) {
  if (!target) {
    return
  }

  let className = target.className

  if (!classes) {
    for (const i in DropPosition) {
      className = className.replace(DropPosition[i], '')
    }

    className = className.replace('dragging', '')
  } else if (!new RegExp(classes).test(className)) {
    className += ' ' + classes
  }

  target.className = className.replace(/\s+/g, ' ')
}

function getDropPosition(e, element) {
  const coords = element.getBoundingClientRect()
  const nodeSection = coords.height / 3

  let dropPosition = DropPosition.ON

  if (coords.top + nodeSection >= e.clientY) {
    dropPosition = DropPosition.ABOVE
  } else if (coords.top + nodeSection * 2 <= e.clientY) {
    dropPosition = DropPosition.BELOW
  }

  return dropPosition
}

function callDndCb(args, opts, method) {
  if (!opts || !opts[method] || typeof opts[method] !== 'function') {
    return
  }

  return opts[method](...args) !== false
}

function clearDropClasses(parent) {
  for (const key in DropPosition) {
    const el = parent.querySelectorAll(`.${DropPosition[key]}`)

    for (let i = 0; i < el.length; i++) {
      updateHelperClasses(el[i])
    }
  }
}

export function useDragAndDrop({ tree, options, draggableNode, rootEl }) {
  // State for drag & drop operations
  const startDragPosition = ref(null)
  const possibleDragNode = ref(null)
  const dropDestination = ref(null)

  // Prevent default drag behavior
  const onDragStart = (e) => {
    e.preventDefault()
  }

  const startDragging = (node, event) => {
    if (!node.isDraggable() || callDndCb([node], options, 'onDragStart') === false) {
      return
    }

    startDragPosition.value = [event.clientX, event.clientY]
    possibleDragNode.value = node

    initDragListeners()
  }

  const initDragListeners = () => {
    let dropPosition

    const removeListeners = () => {
      window.removeEventListener('mouseup', onMouseUp, true)
      window.removeEventListener('mousemove', onMouseMove, true)
    }

    const onMouseUp = (e) => {
      if (!startDragPosition.value) {
        e.stopPropagation()
      }

      if (draggableNode.value) {
        draggableNode.value.node.state('dragging', false)
      }

      if (dropDestination.value && tree.value.isNode(dropDestination.value) && dropDestination.value.vm) {
        updateHelperClasses(dropDestination.value.vm.$el, null)

        const cbResult = callDndCb(
          [draggableNode.value.node, dropDestination.value, dropPosition],
          options,
          'onDragFinish'
        )

        if (cbResult !== false && !(!dropDestination.value.isDropable() && dropPosition === DropPosition.ON || !dropPosition)) {
          draggableNode.value.node.finishDragging(dropDestination.value, dropPosition)
          draggableNode.value.node.parent = dropDestination.value
        }

        dropDestination.value = null
      }

      possibleDragNode.value = null
      draggableNode.value = null

      removeListeners()
    }

    const onMouseMove = (e) => {
      if (startDragPosition.value && !isMovingStarted(e, startDragPosition.value)) {
        return
      } else {
        startDragPosition.value = null
      }

      if (possibleDragNode.value) {
        if (possibleDragNode.value.startDragging() === false) {
          removeListeners()
          possibleDragNode.value = null

          return
        }

        draggableNode.value = reactive({
          node: possibleDragNode.value,
          left: 0,
          top: 0
        })

        possibleDragNode.value = null
      }

      if (draggableNode.value) {
        draggableNode.value.left = e.clientX
        draggableNode.value.top = e.clientY
      }

      const dropDest = getDropDestination(e)

      clearDropClasses(rootEl.value)

      if (dropDest) {
        const dropDestinationId = dropDest.getAttribute('data-id')

        if (draggableNode.value.node.id === dropDestinationId) {
          return
        }

        if (!dropDestination.value || dropDestination.value.id !== dropDestinationId) {
          dropDestination.value = tree.value.getNodeById(dropDestinationId)
        }

        if (dropDestination.value && draggableNode.value.node) {
          const path = dropDestination.value.getPath()

          if (path.includes(draggableNode.value.node)) {
            dropDestination.value = null
            return
          }
        }

        dropPosition = getDropPosition(e, dropDest)

        const cbResult = callDndCb(
          [draggableNode.value.node, dropDestination.value, dropPosition],
          options,
          'onDragOn'
        )

        const isDropable = dropDestination.value.isDropable() && cbResult !== false

        if (!isDropable && dropPosition === DropPosition.ON) {
          dropPosition = null
        }

        updateHelperClasses(dropDest, dropPosition)
      }
    }

    window.addEventListener('mouseup', onMouseUp, true)
    window.addEventListener('mousemove', onMouseMove, true)
  }

  return {
    // Export constants
    DropPosition,

    // Export state
    startDragPosition,
    possibleDragNode,
    dropDestination,

    // Export methods
    onDragStart,
    startDragging,
    initDragListeners,

    // Export helper functions
    isMovingStarted,
    getSelectedNode,
    getDropDestination,
    updateHelperClasses,
    getDropPosition,
    clearDropClasses,
    callDndCb
  }
}
