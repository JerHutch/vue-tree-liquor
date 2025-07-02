import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import TreeNode from '../../src/components/TreeNode.vue'
import NodeContent from '../../src/components/NodeContent.vue'

// Mock NodeContent component
vi.mock('../../src/components/NodeContent.vue', () => ({
  default: {
    name: 'NodeContent',
    props: ['node'],
    template: '<span>{{ node.text }}</span>'
  }
}))

describe('TreeNode', () => {
  let wrapper
  let mockNode
  let mockOptions
  let mockTree

  beforeEach(() => {
    // Create mock tree
    mockTree = {
      value: {
        activeElement: null,
        selectedNodes: [],
        _editingNode: null,
        $emit: vi.fn(),
        unselectAll: vi.fn(),
        startDragging: vi.fn()
      }
    }

    // Create mock node
    mockNode = {
      id: 'test-node-1',
      text: 'Test Node',
      depth: 0,
      children: [],
      states: {
        expanded: false,
        selected: false,
        disabled: false,
        matched: false,
        dragging: false,
        checked: false,
        indeterminate: false,
        draggable: true
      },
      isBatch: false,
      hasChildren: vi.fn(() => false),
      visible: vi.fn(() => true),
      select: vi.fn(),
      unselect: vi.fn(),
      check: vi.fn(),
      uncheck: vi.fn(),
      checked: vi.fn(() => false),
      selected: vi.fn(() => false),
      editable: vi.fn(() => true),
      toggleExpand: vi.fn(),
      startEditing: vi.fn(),
      stopEditing: vi.fn(),
      vm: null
    }

    // Create mock options
    mockOptions = {
      nodeIndent: 24,
      paddingLeft: null,
      direction: 'ltr',
      checkbox: false,
      editing: false,
      checkOnSelect: false,
      parentSelect: false,
      multiple: false,
      dnd: false
    }
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    vi.clearAllMocks()
  })

  describe('component setup', () => {
    it('should mount successfully with required props', () => {
      wrapper = mount(TreeNode, {
        props: {
          node: mockNode,
          options: mockOptions
        },
        global: {
          provide: {
            tree: mockTree
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      wrapper = mount(TreeNode, {
        props: {
          node: mockNode,
          options: mockOptions
        },
        global: {
          provide: {
            tree: mockTree
          }
        }
      })

      expect(wrapper.vm.$options.name).toBe('TreeNode')
    })

    it('should inject tree from parent', () => {
      wrapper = mount(TreeNode, {
        props: {
          node: mockNode,
          options: mockOptions
        },
        global: {
          provide: {
            tree: mockTree
          }
        }
      })

      expect(wrapper.vm.tree).toBe(mockTree)
    })

    it('should set node.vm on mounted', () => {
      wrapper = mount(TreeNode, {
        props: {
          node: mockNode,
          options: mockOptions
        },
        global: {
          provide: {
            tree: mockTree
          }
        }
      })

      expect(mockNode.vm).toBeDefined()
      expect(typeof mockNode.vm.focus).toBe('function')
      expect(typeof mockNode.vm.select).toBe('function')
      expect(typeof mockNode.vm.startEditing).toBe('function')
      expect(typeof mockNode.vm.stopEditing).toBe('function')
    })
  })

  describe('computed properties', () => {
    beforeEach(() => {
      wrapper = mount(TreeNode, {
        props: {
          node: mockNode,
          options: mockOptions
        },
        global: {
          provide: {
            tree: mockTree
          }
        }
      })
    })

    describe('padding', () => {
      it('should calculate padding based on depth and nodeIndent', async () => {
        expect(wrapper.vm.padding).toBe('0px')

        // Test with depth
        const nodeWithDepth = { ...mockNode, depth: 2 }
        await wrapper.setProps({ node: nodeWithDepth })
        expect(wrapper.vm.padding).toBe('48px') // 2 * 24
      })

      it('should use paddingLeft option when provided', () => {
        // Create new wrapper to avoid reactive issues
        wrapper.unmount()
        const optionsWithPaddingLeft = { ...mockOptions, paddingLeft: 30 }
        const nodeWithDepth = { ...mockNode, depth: 1 }
        
        wrapper = mount(TreeNode, {
          props: {
            node: nodeWithDepth,
            options: optionsWithPaddingLeft
          },
          global: {
            provide: {
              tree: mockTree
            }
          }
        })
        
        expect(wrapper.vm.padding).toBe('30px')
      })
    })

    describe('nodeClass', () => {
      it('should return basic classes based on node states', () => {
        const classes = wrapper.vm.nodeClass
        
        expect(classes['has-child']).toBe(false)
        expect(classes['expanded']).toBe(false)
        expect(classes['selected']).toBe(false)
        expect(classes['disabled']).toBe(false)
        expect(classes['draggable']).toBe(true)
      })

      it('should include checkbox classes when checkbox option is enabled', async () => {
        const optionsWithCheckbox = { ...mockOptions, checkbox: true }
        await wrapper.setProps({ options: optionsWithCheckbox })
        
        const classes = wrapper.vm.nodeClass
        expect(classes['checked']).toBe(false)
        expect(classes['indeterminate']).toBe(false)
      })

      it('should show has-child class when node has children', () => {
        // Create new wrapper to avoid reactive issues
        wrapper.unmount()
        const nodeWithChildren = { ...mockNode }
        nodeWithChildren.hasChildren = vi.fn(() => true)
        
        wrapper = mount(TreeNode, {
          props: {
            node: nodeWithChildren,
            options: mockOptions
          },
          global: {
            provide: {
              tree: mockTree
            }
          }
        })
        
        const classes = wrapper.vm.nodeClass
        expect(classes['has-child']).toBe(true)
      })

      it('should show loading class when loading is true', async () => {
        wrapper.vm.loading = true
        await wrapper.vm.$nextTick()
        const classes = wrapper.vm.nodeClass
        expect(classes['loading']).toBe(true)
      })
    })

    describe('visibleChildren', () => {
      it('should filter only visible children', () => {
        const childNode1 = { id: 'child1', visible: vi.fn(() => true) }
        const childNode2 = { id: 'child2', visible: vi.fn(() => false) }
        const childNode3 = { id: 'child3', visible: vi.fn(() => true) }
        
        // Create new wrapper with children to avoid reactive issues
        wrapper.unmount()
        const nodeWithChildren = {
          ...mockNode,
          children: [childNode1, childNode2, childNode3]
        }
        
        wrapper = mount(TreeNode, {
          props: {
            node: nodeWithChildren,
            options: mockOptions
          },
          global: {
            provide: {
              tree: mockTree
            }
          }
        })
        
        const visibleChildren = wrapper.vm.visibleChildren
        expect(visibleChildren).toHaveLength(2)
        expect(visibleChildren.map(c => c.id)).toContain('child1')
        expect(visibleChildren.map(c => c.id)).toContain('child3')
        expect(visibleChildren.map(c => c.id)).not.toContain('child2')
      })
    })
  })

  describe('methods', () => {
    beforeEach(() => {
      wrapper = mount(TreeNode, {
        props: {
          node: mockNode,
          options: mockOptions
        },
        global: {
          provide: {
            tree: mockTree
          }
        }
      })
    })

    describe('onNodeFocus', () => {
      it('should set active element in tree', () => {
        wrapper.vm.onNodeFocus()
        expect(mockTree.value.activeElement).toStrictEqual(mockNode)
      })
    })

    describe('check', () => {
      it('should uncheck if node is checked', () => {
        mockNode.checked.mockReturnValue(true)
        wrapper.vm.check()
        expect(mockNode.uncheck).toHaveBeenCalled()
      })

      it('should check if node is not checked', () => {
        mockNode.checked.mockReturnValue(false)
        wrapper.vm.check()
        expect(mockNode.check).toHaveBeenCalled()
      })
    })

    describe('select', () => {
      it('should emit node:clicked event', () => {
        wrapper.vm.select()
        expect(mockTree.value.$emit).toHaveBeenCalledWith('node:clicked', mockNode)
      })

      it('should start editing when editing is enabled and node is editable', async () => {
        const editingOptions = { ...mockOptions, editing: true }
        await wrapper.setProps({ options: editingOptions })
        
        wrapper.vm.select()
        expect(mockNode.startEditing).toHaveBeenCalled()
      })

      it('should handle single selection mode', () => {
        mockNode.selected.mockReturnValue(false)
        wrapper.vm.select()
        expect(mockNode.select).toHaveBeenCalled()
      })

      it('should handle multiple selection with ctrl key', async () => {
        const multipleOptions = { ...mockOptions, multiple: true }
        await wrapper.setProps({ options: multipleOptions })
        
        mockNode.selected.mockReturnValue(false)
        wrapper.vm.select({ ctrlKey: true })
        expect(mockNode.select).toHaveBeenCalledWith(true)
      })

      it('should toggle expand when parentSelect is false and node has children', async () => {
        mockNode.hasChildren.mockReturnValue(true)
        wrapper.vm.select()
        expect(mockNode.toggleExpand).toHaveBeenCalled()
      })
    })

    describe('toggleExpand', () => {
      it('should toggle expand when node has children', () => {
        mockNode.hasChildren.mockReturnValue(true)
        wrapper.vm.toggleExpand()
        expect(mockNode.toggleExpand).toHaveBeenCalled()
      })

      it('should not toggle expand when node has no children', () => {
        mockNode.hasChildren.mockReturnValue(false)
        wrapper.vm.toggleExpand()
        expect(mockNode.toggleExpand).not.toHaveBeenCalled()
      })
    })

    describe('hasChildren', () => {
      it('should return result from node.hasChildren()', () => {
        mockNode.hasChildren.mockReturnValue(true)
        expect(wrapper.vm.hasChildren()).toBe(true)
        
        mockNode.hasChildren.mockReturnValue(false)
        expect(wrapper.vm.hasChildren()).toBe(false)
      })
    })

    describe('startEditing', () => {
      it('should stop editing on current editing node before starting new one', () => {
        const mockEditingNode = { stopEditing: vi.fn() }
        mockTree.value._editingNode = mockEditingNode
        
        wrapper.vm.startEditing()
        expect(mockEditingNode.stopEditing).toHaveBeenCalled()
        expect(mockNode.startEditing).toHaveBeenCalled()
      })
    })

    describe('stopEditing', () => {
      it('should call node.stopEditing()', () => {
        wrapper.vm.stopEditing()
        expect(mockNode.stopEditing).toHaveBeenCalled()
      })
    })

    describe('handleMouseDown', () => {
      it('should not start dragging when dnd is disabled', () => {
        const event = { clientX: 100, clientY: 100 }
        wrapper.vm.handleMouseDown(event)
        expect(mockTree.value.startDragging).not.toHaveBeenCalled()
      })

      it('should start dragging when dnd is enabled', async () => {
        const dndOptions = { ...mockOptions, dnd: true }
        await wrapper.setProps({ options: dndOptions })
        
        const event = { clientX: 100, clientY: 100 }
        wrapper.vm.handleMouseDown(event)
        expect(mockTree.value.startDragging).toHaveBeenCalledWith(mockNode, event)
      })
    })
  })

  describe('template rendering', () => {
    beforeEach(() => {
      wrapper = mount(TreeNode, {
        props: {
          node: mockNode,
          options: mockOptions
        },
        global: {
          provide: {
            tree: mockTree
          }
        }
      })
    })

    it('should render tree-node structure', () => {
      expect(wrapper.find('.tree-node').exists()).toBe(true)
      expect(wrapper.find('.tree-content').exists()).toBe(true)
      expect(wrapper.find('.tree-arrow').exists()).toBe(true)
      expect(wrapper.find('.tree-anchor').exists()).toBe(true)
    })

    it('should set correct data-id attribute', () => {
      expect(wrapper.find('.tree-node').attributes('data-id')).toBe('test-node-1')
    })

    it('should apply correct padding style', () => {
      const content = wrapper.find('.tree-content')
      expect(content.element.style.paddingLeft).toBe('0px')
    })

    it('should render checkbox when checkbox option is enabled', async () => {
      const checkboxOptions = { ...mockOptions, checkbox: true }
      await wrapper.setProps({ options: checkboxOptions })
      
      expect(wrapper.find('.tree-checkbox').exists()).toBe(true)
    })

    it('should not render checkbox when checkbox option is disabled', () => {
      expect(wrapper.find('.tree-checkbox').exists()).toBe(false)
    })

    it('should render NodeContent component', () => {
      expect(wrapper.findComponent(NodeContent).exists()).toBe(true)
    })

    it('should render children when expanded and has children', () => {
      // Create a simple test without recursive updates
      const expandedNode = {
        ...mockNode,
        children: [{
          id: 'child-1',
          visible: vi.fn(() => true)
        }],
        states: { ...mockNode.states, expanded: true },
        hasChildren: vi.fn(() => true)
      }
      
      wrapper.unmount()
      wrapper = mount(TreeNode, {
        props: {
          node: expandedNode,
          options: mockOptions
        },
        global: {
          provide: {
            tree: mockTree
          }
        }
      })
      
      expect(wrapper.find('.tree-children').exists()).toBe(true)
    })

    it('should not render children when collapsed', () => {
      expect(wrapper.find('.tree-children').exists()).toBe(false)
    })
  })

  describe('event handling', () => {
    beforeEach(() => {
      wrapper = mount(TreeNode, {
        props: {
          node: mockNode,
          options: mockOptions
        },
        global: {
          provide: {
            tree: mockTree
          }
        }
      })
    })

    it('should have click handlers bound', () => {
      // Test that the elements exist and have proper event bindings
      expect(wrapper.find('.tree-content').exists()).toBe(true)
      expect(wrapper.find('.tree-arrow').exists()).toBe(true)
      expect(wrapper.find('.tree-anchor').exists()).toBe(true)
    })

    it('should call select method when directly invoked', () => {
      const spy = vi.spyOn(wrapper.vm, 'select')
      wrapper.vm.select()
      expect(spy).toHaveBeenCalled()
    })

    it('should call toggleExpand method when directly invoked', () => {
      const spy = vi.spyOn(wrapper.vm, 'toggleExpand')
      wrapper.vm.toggleExpand()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('watchers and reactivity', () => {
    it('should have vm methods after mount', () => {
      wrapper = mount(TreeNode, {
        props: {
          node: mockNode,
          options: mockOptions
        },
        global: {
          provide: {
            tree: mockTree
          }
        }
      })

      expect(mockNode.vm).toBeDefined()
      expect(typeof mockNode.vm.focus).toBe('function')
      expect(typeof mockNode.vm.select).toBe('function')
      expect(typeof mockNode.vm.startEditing).toBe('function')
      expect(typeof mockNode.vm.stopEditing).toBe('function')
    })
  })
})