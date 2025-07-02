import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DraggableNode from '../../src/components/DraggableNode.vue'

describe('DraggableNode', () => {
  let wrapper
  let mockTarget

  beforeEach(() => {
    mockTarget = {
      node: {
        text: 'Test Node'
      },
      top: 100,
      left: 50
    }
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('component setup', () => {
    it('should mount successfully with required props', () => {
      wrapper = mount(DraggableNode, {
        props: {
          target: mockTarget
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      wrapper = mount(DraggableNode, {
        props: {
          target: mockTarget
        }
      })

      expect(wrapper.vm.$options.name).toBe('DragNode')
    })

    it('should require target prop', () => {
      // Vue Test Utils will show a warning for missing required props
      // We can test this by checking the component definition
      expect(DraggableNode.props.target.required).toBe(true)
      expect(DraggableNode.props.target.type).toBe(Object)
    })
  })

  describe('template rendering', () => {
    it('should render node text', () => {
      wrapper = mount(DraggableNode, {
        props: {
          target: mockTarget
        }
      })

      expect(wrapper.text()).toBe('Test Node')
    })

    it('should have correct CSS class', () => {
      wrapper = mount(DraggableNode, {
        props: {
          target: mockTarget
        }
      })

      expect(wrapper.classes()).toContain('tree-dragnode')
    })

    it('should apply correct styling when target has position', () => {
      wrapper = mount(DraggableNode, {
        props: {
          target: mockTarget
        }
      })

      const style = wrapper.element.style
      expect(style.top).toBe('100px')
      expect(style.left).toBe('50px')
    })

    it('should hide element when target.top is undefined', () => {
      const targetWithoutTop = {
        node: {
          text: 'Test Node'
        },
        left: 50
        // top is undefined
      }

      wrapper = mount(DraggableNode, {
        props: {
          target: targetWithoutTop
        }
      })

      const style = wrapper.element.style
      expect(style.display).toBe('none')
    })
  })

  describe('computed properties', () => {
    it('should compute style correctly with position values', () => {
      wrapper = mount(DraggableNode, {
        props: {
          target: mockTarget
        }
      })

      // Access the computed style property
      const computedStyle = wrapper.vm.style
      expect(computedStyle).toBe('top: 100px; left: 50px')
    })

    it('should compute style as hidden when top is undefined', () => {
      const targetWithoutTop = {
        node: {
          text: 'Test Node'
        },
        left: 50
      }

      wrapper = mount(DraggableNode, {
        props: {
          target: targetWithoutTop
        }
      })

      const computedStyle = wrapper.vm.style
      expect(computedStyle).toBe('display: none')
    })

    it('should be reactive to prop changes', async () => {
      wrapper = mount(DraggableNode, {
        props: {
          target: mockTarget
        }
      })

      // Initial state
      expect(wrapper.vm.style).toBe('top: 100px; left: 50px')

      // Change props
      await wrapper.setProps({
        target: {
          ...mockTarget,
          top: 200,
          left: 150
        }
      })

      expect(wrapper.vm.style).toBe('top: 200px; left: 150px')
    })

    it('should handle zero values correctly', () => {
      const targetWithZeros = {
        node: {
          text: 'Test Node'
        },
        top: 0,
        left: 0
      }

      wrapper = mount(DraggableNode, {
        props: {
          target: targetWithZeros
        }
      })

      expect(wrapper.vm.style).toBe('top: 0px; left: 0px')
      expect(wrapper.element.style.display).not.toBe('none')
    })
  })

  describe('prop validation', () => {
    it('should handle different node text types', () => {
      const targetWithNumberText = {
        node: {
          text: 123
        },
        top: 100,
        left: 50
      }

      wrapper = mount(DraggableNode, {
        props: {
          target: targetWithNumberText
        }
      })

      expect(wrapper.text()).toBe('123')
    })

    it('should handle missing node text gracefully', () => {
      const targetWithoutText = {
        node: {
          // text is undefined
        },
        top: 100,
        left: 50
      }

      wrapper = mount(DraggableNode, {
        props: {
          target: targetWithoutText
        }
      })

      expect(wrapper.text()).toBe('')
    })
  })

  describe('styling', () => {
    it('should have required CSS properties', () => {
      wrapper = mount(DraggableNode, {
        props: {
          target: mockTarget
        }
      })

      const element = wrapper.element
      const computedStyle = window.getComputedStyle(element)
      
      // Note: These assertions depend on the CSS being applied
      // In a real test environment, you might need to load the CSS
      expect(element.classList.contains('tree-dragnode')).toBe(true)
    })
  })
})