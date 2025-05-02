import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DraggableNode from '../../src/components/DraggableNode.vue'

describe('DraggableNode.vue', () => {
  let wrapper

  const createWrapper = (props) => {
    return mount(DraggableNode, {
      props
    })
  }

  describe('rendering', () => {
    it('should render the component with node text', () => {
      const target = {
        node: { text: 'Node 1' },
        left: 100,
        top: 200
      }

      wrapper = createWrapper({ target })

      expect(wrapper.text()).toContain('Node 1')
      expect(wrapper.classes()).toContain('tree-dragnode')
    })

    it('should be hidden when top position is undefined', () => {
      const target = {
        node: { text: 'Node 1' },
        left: 100
        // top is undefined
      }

      wrapper = createWrapper({ target })

      expect(wrapper.attributes('style')).toContain('display: none')
    })

    it('should position the element based on target coordinates', () => {
      const target = {
        node: { text: 'Node 1' },
        left: 150,
        top: 250
      }

      wrapper = createWrapper({ target })

      expect(wrapper.attributes('style')).toContain('top: 250px')
      expect(wrapper.attributes('style')).toContain('left: 150px')
    })
  })

  describe('props', () => {
    it('should require target prop', () => {
      const consoleError = console.error
      console.error = vitest.fn()

      try {
        // This should trigger a Vue warning about missing required prop
        wrapper = mount(DraggableNode, {})
      } catch (error) {
        expect(console.error).toHaveBeenCalled()
      }

      console.error = consoleError
    })

    it('should update style when target prop changes', async () => {
      const target = {
        node: { text: 'Node 1' },
        left: 100,
        top: 200
      }

      wrapper = createWrapper({ target })
      expect(wrapper.attributes('style')).toContain('top: 200px')

      // Update the prop
      await wrapper.setProps({
        target: {
          ...target,
          top: 300,
          left: 400
        }
      })

      expect(wrapper.attributes('style')).toContain('top: 300px')
      expect(wrapper.attributes('style')).toContain('left: 400px')
    })
  })

  describe('component structure', () => {
    beforeEach(() => {
      const target = {
        node: { text: 'Node 1' },
        left: 100,
        top: 200
      }

      wrapper = createWrapper({ target })
    })

    it('should have correct CSS classes', () => {
      expect(wrapper.classes()).toContain('tree-dragnode')
    })

    it('should have the expected structure', () => {
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('should have correct styling from computed style', () => {
      const computedStyle = wrapper.vm.style
      expect(computedStyle).toContain('top: 200px')
      expect(computedStyle).toContain('left: 100px')
    })
  })
})
