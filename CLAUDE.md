# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 tree component library called LiquorTree - a hierarchical tree view component that supports drag & drop, multi-selection, checkboxes, filtering, and keyboard navigation.

## Development Commands

### Building and Development
- `npm run dev` - Start development server (Vite dev server on port 8081)
- `npm run build` - Build the library for production (creates UMD and ESM bundles)
- `npm run storybook` - Start Storybook development server on port 9001

### Code Quality
- `npm run lint` - Run ESLint on TypeScript and Vue files
- `npm run test` - Run tests using Vitest

## Architecture

### Core Components
- **TreeRoot.vue** - Main tree component that manages the entire tree state, handles options, filtering, and provides tree API methods
- **TreeNode.vue** - Individual tree node component responsible for rendering single nodes
- **DraggableNode.vue** - Handles drag and drop functionality for nodes

### Core Libraries
- **Tree.js** - Main tree controller class that manages the tree data model, selection, filtering, and all tree operations
- **Node.js** - Individual node data model with state management and tree traversal methods
- **Selection.js** - Manages selected/checked node collections

### Key Utilities
- **useDragAndDrop.js** - Vue 3 composable for drag and drop functionality
- **treeParser.js** - Parses raw data into tree node structures
- **keyboardNavigation.js** - Handles keyboard navigation within the tree
- **objectToNode.js** - Converts plain objects to Node instances

### Plugin Architecture
The main entry point (`src/main.js`) exports a Vue 3 plugin that can be installed globally or used as individual components.

### Vue 3 Migration Notes
This codebase has been migrated from Vue 2 to Vue 3. The TreeRoot component uses:
- Vue 3 Composition API in some areas (like useDragAndDrop composable)
- Options API for the main component structure
- Provide/inject for tree instance sharing between components

## Testing
- Uses Vitest for testing
- Test files were removed during Vue 3 migration (noted in git status)
- When writing tests, follow Vitest patterns and Vue 3 testing utilities

## Build Configuration
- Uses Vite for building and development
- Creates both UMD and ESM builds
- External dependency: Vue 3 (peer dependency)
- Build outputs to `dist/` directory with source maps