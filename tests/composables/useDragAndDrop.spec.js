import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref, reactive } from 'vue'
import { useDragAndDrop } from '../../src/composables/useDragAndDrop.js'

// Mock DOM elements and events
const createMockElement = (id, className = 'tree-node', dataId = id) => ({
  id,
  className,
  getAttribute: vi.fn(() => dataId),
  getBoundingClientRect: vi.fn(() => ({
    top: 100,
    height: 30,
    left: 50,
    right: 150,
    bottom: 130
  })),
  parentElement: null,
  tagName: 'DIV',
  querySelectorAll: vi.fn(() => [])
})

const createMockEvent = (clientX = 100, clientY = 110, target = null) => ({
  clientX,
  clientY,
  target: target || createMockElement('test-node'),
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  path: null,
  composedPath: vi.fn(() => [target || createMockElement('test-node')])
})

const createMockNode = (id = 'test-node', isDragOnable = true, isDropOnable = true) => ({
  id,
  isDraggable: vi.fn(() => isDragOnable),
  isDropable: vi.fn(() => isDropOnable),
  startDragging: vi.fn(() => true),
  finishDragging: vi.fn(),
  state: vi.fn(),
  getPath: vi.fn(() => []),
  parent: null,
  vm: {
    $el: createMockElement(id)
  }
})

describe('useDragAndDrop', () => {
  let mockOptions
  let mockDraggableNode
  let mockRootEl
  let mockIsNode
  let mockGetNodeById
  let composable

  beforeEach(() => {
    // Setup mocks
    mockOptions = {
      onDragStart: vi.fn(() => true),
      onDragFinish: vi.fn(() => true),
      onDragOn: vi.fn(() => true)
    }

    mockDraggableNode = ref(null)
    mockRootEl = ref(createMockElement('root'))
    mockIsNode = vi.fn(() => true)
    mockGetNodeById = vi.fn((id) => createMockNode(id))

    // Mock global window methods
    global.window = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }

    // Mock document
    global.document = {
      tagName: 'HTML'
    }

    // Initialize composable
    composable = useDragAndDrop({
      isNode: mockIsNode,
      getNodeById: mockGetNodeById,
      options: mockOptions,
      draggableNode: mockDraggableNode,
      rootEl: mockRootEl
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('exports', () => {
    it('should export DropPosition constants', () => {
      expect(composable.DropPosition).toEqual({
        ABOVE: 'drag-above',
        BELOW: 'drag-below',
        ON: 'drag-on'
      })
    })

    it('should export reactive state', () => {
      expect(composable.startDragPosition).toBeDefined()
      expect(composable.possibleDragNode).toBeDefined()
      expect(composable.dropDestination).toBeDefined()
    })

    it('should export methods', () => {
      expect(typeof composable.onDragStart).toBe('function')
      expect(typeof composable.startDragging).toBe('function')
      expect(typeof composable.initDragListeners).toBe('function')
    })

    it('should export helper functions', () => {
      expect(typeof composable.isMovingStarted).toBe('function')
      expect(typeof composable.getSelectedNode).toBe('function')
      expect(typeof composable.getDropDestination).toBe('function')
      expect(typeof composable.updateHelperClasses).toBe('function')
      expect(typeof composable.getDropPosition).toBe('function')
      expect(typeof composable.clearDropClasses).toBe('function')
      expect(typeof composable.callDndCb).toBe('function')
    })
  })

  describe('onDragStart', () => {
    it('should prevent default drag behavior', () => {
      const mockEvent = createMockEvent()
      composable.onDragStart(mockEvent)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })
  })

  describe('isMovingStarted', () => {
    it('should return true when movement exceeds threshold', () => {
      const event = { clientX: 110, clientY: 110 }
      const start = [100, 100]
      expect(composable.isMovingStarted(event, start)).toBe(true)
    })

    it('should return false when movement is within threshold', () => {
      const event = { clientX: 103, clientY: 103 }
      const start = [100, 100]
      expect(composable.isMovingStarted(event, start)).toBe(false)
    })
  })

  describe('getSelectedNode', () => {
    it('should return node element with tree-node class', () => {
      const mockElement = createMockElement('test', 'tree-node')
      const mockEvent = {
        target: mockElement,
        path: [mockElement],
        composedPath: vi.fn(() => [mockElement])
      }
      
      const result = composable.getSelectedNode(mockEvent)
      expect(result).toBe(mockElement)
    })

    it('should return null when no tree-node found', () => {
      const mockElement = createMockElement('test', 'other-class')
      const mockEvent = {
        target: mockElement,
        path: [mockElement],
        composedPath: vi.fn(() => [mockElement])
      }
      
      const result = composable.getSelectedNode(mockEvent)
      expect(result).toBe(null)
    })
  })

  describe('updateHelperClasses', () => {
    it('should add classes when provided', () => {
      const mockElement = createMockElement('test')
      mockElement.className = 'existing-class'
      
      composable.updateHelperClasses(mockElement, 'new-class')
      expect(mockElement.className).toBe('existing-class new-class')
    })

    it('should remove drag classes when no classes provided', () => {
      const mockElement = createMockElement('test')
      mockElement.className = 'existing-class drag-above drag-below drag-on dragging'
      
      composable.updateHelperClasses(mockElement, null)
      expect(mockElement.className).toBe('existing-class')
    })

    it('should handle null target gracefully', () => {
      expect(() => {
        composable.updateHelperClasses(null, 'some-class')
      }).not.toThrow()
    })
  })

  describe('getDropPosition', () => {
    it('should return ABOVE when cursor is in top third', () => {
      const mockEvent = createMockEvent(100, 105) // Close to top
      const mockElement = createMockElement('test')
      mockElement.getBoundingClientRect.mockReturnValue({
        top: 100,
        height: 30
      })
      
      const position = composable.getDropPosition(mockEvent, mockElement)
      expect(position).toBe(composable.DropPosition.ABOVE)
    })

    it('should return BELOW when cursor is in bottom third', () => {
      const mockEvent = createMockEvent(100, 125) // Close to bottom
      const mockElement = createMockElement('test')
      mockElement.getBoundingClientRect.mockReturnValue({
        top: 100,
        height: 30
      })
      
      const position = composable.getDropPosition(mockEvent, mockElement)
      expect(position).toBe(composable.DropPosition.BELOW)
    })

    it('should return ON when cursor is in middle third', () => {
      const mockEvent = createMockEvent(100, 115) // Middle
      const mockElement = createMockElement('test')
      mockElement.getBoundingClientRect.mockReturnValue({
        top: 100,
        height: 30
      })
      
      const position = composable.getDropPosition(mockEvent, mockElement)
      expect(position).toBe(composable.DropPosition.ON)
    })
  })

  describe('callDndCb', () => {
    it('should call callback function with arguments', () => {
      const callback = vi.fn(() => true)
      const options = { testCallback: callback }
      const args = ['arg1', 'arg2']
      
      const result = composable.callDndCb(args, options, 'testCallback')
      expect(callback).toHaveBeenCalledWith('arg1', 'arg2')
      expect(result).toBe(true)
    })

    it('should return undefined when callback does not exist', () => {
      const options = {}
      const args = ['arg1', 'arg2']
      
      const result = composable.callDndCb(args, options, 'nonExistentCallback')
      expect(result).toBeUndefined()
    })

    it('should return undefined when callback is not a function', () => {
      const options = { testCallback: 'not a function' }
      const args = ['arg1', 'arg2']
      
      const result = composable.callDndCb(args, options, 'testCallback')
      expect(result).toBeUndefined()
    })
  })

  describe('startDragging', () => {
    it('should initialize drag state when node is draggable', () => {
      const mockNode = createMockNode('test-node', true)
      const mockEvent = createMockEvent(100, 110)
      
      composable.startDragging(mockNode, mockEvent)
      
      expect(composable.startDragPosition.value).toEqual([100, 110])
      expect(composable.possibleDragNode.value).toBe(mockNode)
      expect(mockOptions.onDragStart).toHaveBeenCalledWith(mockNode)
    })

    it('should not start dragging when node is not draggable', () => {
      const mockNode = createMockNode('test-node', false)
      const mockEvent = createMockEvent(100, 110)
      
      composable.startDragging(mockNode, mockEvent)
      
      expect(composable.startDragPosition.value).toBe(null)
      expect(composable.possibleDragNode.value).toBe(null)
    })

    it('should not start dragging when onDragStart callback returns false', () => {
      mockOptions.onDragStart.mockReturnValue(false)
      const mockNode = createMockNode('test-node', true)
      const mockEvent = createMockEvent(100, 110)
      
      composable.startDragging(mockNode, mockEvent)
      
      expect(composable.startDragPosition.value).toBe(null)
      expect(composable.possibleDragNode.value).toBe(null)
    })
  })

  describe('clearDropClasses', () => {
    it('should clear all drop position classes from parent element', () => {
      const mockElement1 = createMockElement('el1')
      const mockElement2 = createMockElement('el2')
      const mockParent = createMockElement('parent')
      
      mockParent.querySelectorAll.mockImplementation((selector) => {
        if (selector === '.drag-above') return [mockElement1]
        if (selector === '.drag-below') return [mockElement2]
        if (selector === '.drag-on') return []
        return []
      })
      
      composable.clearDropClasses(mockParent)
      
      expect(mockParent.querySelectorAll).toHaveBeenCalledWith('.drag-above')
      expect(mockParent.querySelectorAll).toHaveBeenCalledWith('.drag-below')
      expect(mockParent.querySelectorAll).toHaveBeenCalledWith('.drag-on')
    })
  })

  describe('reactive state', () => {
    it('should have reactive startDragPosition', () => {
      expect(composable.startDragPosition.value).toBe(null)
      composable.startDragPosition.value = [100, 200]
      expect(composable.startDragPosition.value).toEqual([100, 200])
    })

    it('should have reactive possibleDragNode', () => {
      expect(composable.possibleDragNode.value).toBe(null)
      const mockNode = createMockNode('test')
      composable.possibleDragNode.value = mockNode
      expect(composable.possibleDragNode.value).toBe(mockNode)
    })

    it('should have reactive dropDestination', () => {
      expect(composable.dropDestination.value).toBe(null)
      const mockNode = createMockNode('test')
      composable.dropDestination.value = mockNode
      expect(composable.dropDestination.value).toBe(mockNode)
    })
  })
})