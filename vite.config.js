import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from './package.json';

const __dirname = dirname(fileURLToPath(import.meta.url));

const banner = `
/*!
 * LiquorTree v${pkg.version}
 * (c) ${new Date().getFullYear()} amsik
 * Released under the MIT License.
 */
`;

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/main.js'), // Make sure this path matches your source
        name: 'LiquorTree',
        fileName: (format) => format === 'es'
          ? 'liquor-tree.esm.js'
          : 'liquor-tree.umd.js'
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          banner,
          globals: {
            vue: 'Vue'
          }
        }
      },
      sourcemap: true,
      minify: mode === 'production'
    },
    server: isDev ? {
      port: 8081,
      open: true
    } : {}
  };
});
