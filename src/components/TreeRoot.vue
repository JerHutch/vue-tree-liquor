

<script>
  import TreeNode from './TreeNode.vue'
  import DraggableNode from './DraggableNode.vue'
  import initKeyboardNavigation from '../utils/keyboardNavigation'
  import assert from '../utils/assert'
  import Tree from '../lib/Tree.js'
  import { useDragAndDrop } from '../composables/useDragAndDrop.js'

  const defaults = {
    direction: 'ltr',
    multiple: true,
    checkbox: false,
    checkOnSelect: false,
    autoCheckChildren: true,
    autoDisableChildren: true,
    checkDisabledChildren: true,
    parentSelect: false,
    keyboardNavigation: true,
    nodeIndent: 24,
    minFetchDelay: 0,
    fetchData: null,
    propertyNames: null,
    deletion: false,
    dnd: false,
    editing: false,
    onFetchError: function(err) { throw err }
  }

  const filterDefaults = {
    emptyText: 'Nothing found!',
    matcher(query, node) {
      const isMatched = new RegExp(query, 'i').test(node.text)

      if (isMatched) {
        if (node.parent && new RegExp(query, 'i').test(node.parent.text)) {
          return false
        }
      }

      return isMatched
    },
    plainList: false,
    showChildren: true
  };

  function initEvents (vm) {
  const { multiple, checkbox } = vm.opts
  const tree = vm.tree

  const emitter = (obj) => {
    // const selected = vm.selected()

    if (!checkbox) {
      vm.$emit('input', multiple ? selected : (selected[0] || null))
    } else {
      vm.$emit('input', {
        selected: multiple ? selected : (selected[0] || null),
        checked: vm.checked()
      })
    }
  }

  emitter()

  tree.$on('node:selected', emitter)
  tree.$on('node:unselected', emitter)

  if (checkbox) {
    tree.$on('node:checked', emitter)
    tree.$on('node:unchecked', emitter)
  }

  tree.$on('node:added', (targetNode, newNode) => {
    const node = newNode || targetNode

    if (checkbox) {
      if (node.state('checked') && !tree.checkedNodes.has(node)) {
        tree.checkedNodes.add(node)
      }

      node.refreshIndeterminateState()
    }

    if (node.state('selected') && !tree.selectedNodes.has(node)) {
      tree.select(node)
    }

    emitter()
  })
}

  export default {
    name: 'Tree',
    components: {
      TreeNode,
      DraggableNode
    },

    provide: _ => ({
      tree: null
    }),

    props: {
      data: {},

      options: {
        type: Object,
        default: _ => ({})
      },

      filter: String,

      tag: {
        type: String,
        default: 'div'
      }
    },

    data () {
      // we should not mutating a prop directly...
      // that's why we have to create a new object
      // TODO: add method for changing options
      let opts = Object.assign({}, defaults, this.options)

      opts.filter = Object.assign(
        {},
        filterDefaults,
        opts.filter
      )

      return {
        model: [],
        tree: null,
        loading: false,
        opts,
        matches: [],
        draggableNode: null
      }
    },

    computed: {
      visibleModel() {
        return this.model.filter(function(node) {
          return node && node.visible()
        })
      },
      visibleMatches() {
        return this.matches.filter(function(node) {
          return node && node.visible()
        })
      }
    },

    watch: {
      filter (term) {
        this.tree.filter(term)
      }
    },
    mounted () {
    const tree = new Tree(this)
    let dataProvider

    this.tree = tree
    this._provided.tree = tree

    if (!this.data && this.opts.fetchData) {
      // Get initial data if we don't have a data directly
      // In this case we call 'fetcher' with node.id == 'root' && node.name == 'root'
      dataProvider = tree.fetchInitData()
    } else if (this.data && this.data.then) {
      // Yeah... nice check!
      dataProvider = this.data
      this.loading = true
    } else {
      dataProvider = Promise.resolve(this.data)
    }

    dataProvider.then(data => {
      if (!data) {
        data = []
      }

      if (this.opts.store) {
        this.connectStore(this.opts.store)
      } else {
        this.tree.setModel(data)
      }

      if (this.loading) {
        this.loading = false
      }

      this.$emit('tree:mounted', this)

      initEvents(this)
    })

    if (this.opts.keyboardNavigation !== false) {
      initKeyboardNavigation(tree)
    }
  },
  methods: {
    connectStore (store) {
      const { store: Store, mutations, getter, dispatcher } = store

      assert(typeof getter === 'function', '`getter` must be a function')
      assert(typeof dispatcher === 'function', '`dispatcher` must be a function')

      if (undefined !== mutations) {
        assert(Array.isArray(mutations), '`mutations` must be an array')
      }

      Store.subscribe((action, state) => {
        if (!mutations) {
          this.tree.setModel(getter())
        } else if (mutations.includes(action.type)) {
          this.tree.setModel(getter())
        }
      })

      this.tree.setModel(getter())

      this.$on('LIQUOR_NOISE', () => {
        this.$nextTick(_ => {
          dispatcher(this.toJSON())
        })
      })
    },

    recurseDown (fn) {
      this.tree.recurseDown(fn)
    },

    selected () {
      return this.tree.selected()
    },

    checked () {
      return this.tree.checked()
    },

    append (criteria, node) {
      // append to model
      if (!node) {
        return this.tree.addToModel(criteria, this.tree.model.length)
      }

      return this.tree.append(criteria, node)
    },

    prepend (criteria, node) {
      if (!node) {
        return this.tree.addToModel(criteria, 0)
      }

      return this.tree.prepend(criteria, node)
    },

    addChild (criteria, node) {
      return this.append(criteria, node)
    },

    remove (criteria, multiple) {
      return this.tree.remove(criteria, multiple)
    },

    before (criteria, node) {
      if (!node) {
        return this.prepend(criteria)
      }

      return this.tree.before(criteria, node)
    },

    after (criteria, node) {
      if (!node) {
        return this.append(criteria)
      }

      return this.tree.after(criteria, node)
    },

    find (criteria, multiple) {
      return this.tree.find(criteria, multiple)
    },

    findAll (criteria) {
      return this.tree.find(criteria, true)
    },

    expandAll () {
      return this.tree.expandAll()
    },

    updateData (criteria, callback) {
      return this.tree.updateData(criteria, callback)
    },

    collapseAll () {
      return this.tree.collapseAll()
    },

    sortTree (compareFn, deep) {
      return this.tree.sortTree(compareFn, deep)
    },

    sort (...args) {
      return this.tree.sort(...args)
    },

    setModel (data) {
      return this.tree.setModel(data)
    },

    getRootNode () {
      return this.tree.model.length === 1
        ? this.tree.model[0]
        : this.tree.model
    },

    toJSON () {
      return JSON.parse(
        JSON.stringify(this.model)
      )
    }
  }
  }
</script>

<template>
  <component
    :is="tag"
    role="tree"
    :class="{'tree': true, 'tree-loading': this.loading, 'tree--draggable' : !!this.draggableNode}"
  >
    <template v-if="filter && matches.length == 0">
      <div
        class="tree-filter-empty"
        v-html="opts.filter.emptyText"
      />
    </template>
    <template v-else>
      <ul
        class="tree-root"
        @dragstart="onDragStart"
      >
        <template v-if="opts.filter.plainList && matches.length > 0">
          <TreeNode
            v-for="node in visibleMatches"
            :key="node.id"
            :node="node"
            :options="opts"
          />
        </template>
        <template v-else>
          <TreeNode
            v-for="node in visibleModel"
            :key="node.id"
            :node="node"
            :options="opts"
          />
        </template>
      </ul>
    </template>

    <DraggableNode
      v-if="draggableNode"
      :target="draggableNode"
    />
  </component>
</template>

<style>
  .tree {
    overflow: auto;
  }

  .tree-root,
  .tree-children {
    list-style: none;
    padding: 0;
  }

  .tree > .tree-root,
  .tree > .tree-filter-empty {
    padding: 3px;
    box-sizing: border-box;
  }

  .tree.tree--draggable .tree-node:not(.selected) > .tree-content:hover {
    background: transparent;
  }

  .drag-above,
  .drag-below,
  .drag-on {
    position: relative;
    z-index: 1;
  }

  .drag-on > .tree-content {
    background: #fafcff;
    outline: 1px solid #7baff2;
  }

  .drag-above > .tree-content::before, .drag-below > .tree-content::after {
    display: block;
    content: '';
    position: absolute;
    height: 8px;
    left: 0;
    right: 0;
    z-index: 2;
    box-sizing: border-box;
    background-color: #3367d6;
    border: 3px solid #3367d6;
    background-clip: padding-box;
    border-bottom-color: transparent;
    border-top-color: transparent;
    border-radius: 0;
  }

  .drag-above > .tree-content::before {
    top: 0;
    transform: translateY(-50%);
  }

  .drag-below > .tree-content::after {
    bottom: 0;
    transform: translateY(50%);
  }
</style>
