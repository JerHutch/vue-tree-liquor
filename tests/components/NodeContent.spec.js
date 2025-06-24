import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import NodeContent from '../../src/components/NodeContent.vue'

describe('NodeContent.vue', () => {
  let wrapper

  const createNode = (overrides = {}) => {
    return {
      text: 'Node Text',
      isEditing: false,
      stopEditing: vi.fn(),
      ...overrides
    }
  }

  const createWrapper = (node, slots = {}) => {
    return mount(NodeContent, {
      props: { node },
      slots
    })
  }

  describe('when node is not in editing mode', () => {
    it('renders node text when no default slot provided', () => {
      const node = createNode()
      wrapper = createWrapper(node)

      expect(wrapper.html()).toContain('Node Text')
      expect(wrapper.find('span').exists()).toBe(true)
      expect(wrapper.find('input').exists()).toBe(false)
    })

    it('renders HTML content correctly', () => {
      const node = createNode({ text: '<strong>Bold Text</strong>' })
      wrapper = createWrapper(node)

      expect(wrapper.html()).toContain('<strong>Bold Text</strong>')
    })

    it('uses default slot when provided', () => {
      const node = createNode()
      const CustomComponent = {
        template: '<div>Custom Component: {{ node.text }}</div>',
        props: ['node']
      }

      wrapper = mount(NodeContent, {
        props: { node },
        slots: {
          default: CustomComponent
        }
      })

      expect(wrapper.html()).toContain('Custom Component: Node Text')
    })
  })

  describe('when node is in editing mode', () => {
    let node

    beforeEach(() => {
      node = createNode({ isEditing: true })
      wrapper = createWrapper(node)
    })

    it('renders an input field', () => {
      expect(wrapper.find('input').exists()).toBe(true)
      expect(wrapper.find('input').classes('tree-input')).toBe(true)
    })

    it('sets input value to node text', () => {
      expect(wrapper.find('input').element.value).toBe('Node Text')
    })

    it('calls stopEditing when input loses focus', async () => {
      await wrapper.find('input').trigger('blur')
      expect(node.stopEditing).toHaveBeenCalled()
    })

    it('calls stopEditing when Enter key is pressed', async () => {
      await wrapper.find('input').trigger('keyup.enter')
      expect(node.stopEditing).toHaveBeenCalled()
    })

    it('updates nodeText when input value changes', async () => {
      const input = wrapper.find('input')

      // Set the input value
      await input.setValue('Updated Text')

      // Trigger blur to call stopEditing
      await input.trigger('blur')

      // Check if stopEditing was called with the updated value
      expect(node.stopEditing).toHaveBeenCalledWith('Updated Text')
    })

    it('focuses the input when isEditing becomes true', async () => {
      // Create a non-editing node first
      const nonEditingNode = createNode({ isEditing: false })
      wrapper = createWrapper(nonEditingNode)

      // Mock the focus method
      const focusSpy = vi.fn()
      HTMLInputElement.prototype.focus = focusSpy

      // Change to editing mode
      await wrapper.setProps({
        node: createNode({ isEditing: true })
      })

      // Wait for nextTick to complete
      await flushPromises()

      // Check if focus was called
      expect(focusSpy).toHaveBeenCalled()
    })

    it('stops event propagation on mouseup', async () => {
      const event = { stopPropagation: vi.fn() }
      await wrapper.find('input').trigger('mouseup', event)

      // Vue handles the stop modifier internally, so we can only verify
      // the event is properly configured
      expect(wrapper.find('input').attributes()).toHaveProperty('@mouseup.stop')
    })
  })

  describe('reactive behavior', () => {
    it('updates when node text changes', async () => {
      const node = createNode()
      wrapper = createWrapper(node)

      expect(wrapper.text()).toBe('Node Text')

      await wrapper.setProps({
        node: createNode({ text: 'Updated Node Text' })
      })

      expect(wrapper.text()).toBe('Updated Node Text')
    })

    it('updates from editing mode to non-editing mode', async () => {
      const node = createNode({ isEditing: true })
      wrapper = createWrapper(node)

      expect(wrapper.find('input').exists()).toBe(true)

      await wrapper.setProps({
        node: createNode({ isEditing: false })
      })

      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.find('span').exists()).toBe(true)
    })
  })
})
