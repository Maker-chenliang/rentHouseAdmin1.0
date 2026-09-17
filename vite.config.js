import {
  defineConfig,
  loadEnv
} from 'vite'
import vue from '@vitejs/plugin-vue'
import {
  fileURLToPath,
  URL
} from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {
  ElementPlusResolver
} from 'unplugin-vue-components/resolvers'
import process from 'node:process'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
export default defineConfig(({
  mode
}) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver(), IconsResolver({
          prefix: 'Icon', // 图标组件自动导入的前缀，可自定义
        }), ],

      }),
      Components({
        resolvers: [ElementPlusResolver(),
          IconsResolver({
            enabledCollections: ['ep'], // 允许自动导入 Element Plus 的图标集
          }),
        ],

      }),
      Icons({
        autoInstall: true, // 自动安装图标集
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       // 全局注入变量文件，页面里不用再 import
    //       additionalData: '@use "@/styles/variable.scss" as *;',
    //     },
    //   },
    // },
    server: {
      host: 'localhost',
      proxy: {
        '/admin': {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
        },
      },
    },
  }
})
