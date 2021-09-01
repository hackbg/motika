import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import CommonJSExternals from 'vite-plugin-commonjs-externals'

// https://vitejs.dev/config/
export default defineConfig({
  base: (process.env.ELECTRON=="true") ? './' : "",
  plugins: [
    vue(),
    //CommonJSExternals({ externals: ['child_process'] })
  ],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' }
    ]
  }
})
