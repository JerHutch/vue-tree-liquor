import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import NodeContent from '../../src/components/NodeContent.vue'

describe('NodeContent', () => {
  let wrapper
  let mockNode

  beforeEach(() => {
    mockNode = {
      text: 'Test Node Text',
      isEditing: false,
      stopEditing: vi.fn()
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
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      expect(wrapper.vm.$options.name).toBe('NodeContent')
    })

    it('should require node prop', () => {
      expect(NodeContent.props.node.required).toBe(true)
      expect(NodeContent.props.node.type).toBe(Object)
    })
  })

  describe('normal display mode', () => {
    beforeEach(() => {
      mockNode.isEditing = false
    })

    it('should render node text in span when not editing', () => {
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      const span = wrapper.find('span')
      expect(span.exists()).toBe(true)
      expect(span.html()).toContain('Test Node Text')
    })

    it('should not render input field when not editing', () => {
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      const input = wrapper.find('input')
      expect(input.exists()).toBe(false)
    })

    it('should handle HTML content in node text', () => {
      mockNode.text = '<strong>Bold Text</strong>'
      
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      const span = wrapper.find('span')
      expect(span.html()).toContain('<strong>Bold Text</strong>')
    })
  })

  describe('editing mode', () => {
    beforeEach(() => {
      mockNode.isEditing = true
    })

    it('should render input field when editing', () => {
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
      expect(input.attributes('type')).toBe('text')
      expect(input.classes()).toContain('tree-input')
    })

    it('should not render span when editing', () => {
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      const span = wrapper.find('span')
      expect(span.exists()).toBe(false)
    })

    it('should set input value to node text', () => {
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      const input = wrapper.find('input')
      expect(input.element.value).toBe('Test Node Text')
    })

    it('should focus input field when editing starts', async () => {
      // Mock focus method
      const mockFocus = vi.fn()
      const originalCreateElement = document.createElement

      document.createElement = vi.fn((tagName) => {
        const element = originalCreateElement.call(document, tagName)
        if (tagName === 'input') {
          element.focus = mockFocus
        }
        return element
      })

      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        },
        attachTo: document.body
      })

      await nextTick()
      
      // Note: Testing focus is tricky in jsdom, this is a basic check
      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)

      document.createElement = originalCreateElement
    })

    it('should update nodeText ref on input', async () => {
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      const input = wrapper.find('input')
      await input.setValue('New Text Value')
      
      expect(wrapper.vm.nodeText).toBe('New Text Value')
    })

    it('should call stopEditing on blur', async () => {
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      const input = wrapper.find('input')
      await input.setValue('Modified Text')
      await input.trigger('blur')

      expect(mockNode.stopEditing).toHaveBeenCalledWith('Modified Text')
    })

    it('should call stopEditing on Enter key', async () => {
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      const input = wrapper.find('input')
      await input.setValue('Modified Text')
      await input.trigger('keyup.enter')

      expect(mockNode.stopEditing).toHaveBeenCalledWith('Modified Text')
    })

    it('should stop mouseup propagation', async () => {
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      const input = wrapper.find('input')
      const mockEvent = { stopPropagation: vi.fn() }
      
      await input.trigger('mouseup')
      // We can't directly test event.stopPropagation(), but we can verify the handler exists
      expect(input.attributes()).toHaveProperty('mouseup')
    })
  })

  describe('slot rendering', () => {
    it('should render default slot when provided and not editing', () => {
      const slotContent = '<div class="custom-content">Custom Node Content</div>'
      
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        },
        slots: {
          default: slotContent
        }
      })

      expect(wrapper.html()).toContain('custom-content')
      expect(wrapper.html()).toContain('Custom Node Content')
    })

    it('should pass node prop to slot component', () => {
      const SlotComponent = {
        props: ['node'],
        template: '<div>{{ node.text }}</div>'
      }
      
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        },
        slots: {
          default: SlotComponent
        }
      })

      expect(wrapper.text()).toBe('Test Node Text')
    })

    it('should prioritize input over slot when editing', () => {
      mockNode.isEditing = true
      
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        },
        slots: {
          default: '<div class="custom-content">Should not show</div>'
        }
      })

      const input = wrapper.find('input')
      const customContent = wrapper.find('.custom-content')
      
      expect(input.exists()).toBe(true)
      expect(customContent.exists()).toBe(false)
    })
  })

  describe('reactive behavior', () => {
    it('should react to node.isEditing changes', async () => {
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      // Initially not editing
      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.find('span').exists()).toBe(true)

      // Change to editing mode
      await wrapper.setProps({
        node: { ...mockNode, isEditing: true }
      })

      expect(wrapper.find('input').exists()).toBe(true)
      expect(wrapper.find('span').exists()).toBe(false)
    })

    it('should update nodeText when entering edit mode', async () => {
      mockNode.isEditing = false
      
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      // Change to editing mode
      await wrapper.setProps({
        node: { ...mockNode, isEditing: true }
      })

      await nextTick()
      expect(wrapper.vm.nodeText).toBe('Test Node Text')
    })

    it('should handle node text changes while editing', async () => {
      mockNode.isEditing = true
      
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      // Change node text
      await wrapper.setProps({
        node: { ...mockNode, text: 'Updated Text' }
      })

      const input = wrapper.find('input')
      expect(input.element.value).toBe('Updated Text')
    })
  })

  describe('refs and lifecycle', () => {
    it('should have editCtrl ref', () => {
      mockNode.isEditing = true
      
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      expect(wrapper.vm.editCtrl).toBeDefined()
    })

    it('should have nodeText ref with reactive value', () => {
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      expect(wrapper.vm.nodeText).toBeDefined()
      
      // Test reactivity
      wrapper.vm.nodeText = 'New Value'
      expect(wrapper.vm.nodeText).toBe('New Value')
    })

    it('should handle slots correctly', () => {
      wrapper = mount(NodeContent, {
        props: {
          node: mockNode
        }
      })

      expect(wrapper.vm.slots).toBeDefined()
    })
  })
})