const { defineConfig } = require('@vue/cli-service')
const webpack = require("webpack");
module.exports = defineConfig({
  devServer: {
    // 端口号的配置
    port: 20000
  },
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery"
      })
    ]
  }
})


// const { defineConfig } = require('@vue/cli-service')
// const webpack = require("webpack");
//
// module.exports = defineConfig({
//   devServer: {
//     // 端口号配置
//     port: 20000,
//     // 允许通过局域网/外网访问
//     host: '0.0.0.0',
//     // 允许任意 Host 头（包括你自定义的 buqiu.icu）
//     allowedHosts: 'all'
//   },
//   transpileDependencies: true,
//   lintOnSave: false,
//   configureWebpack: {
//     plugins: [
//       new webpack.ProvidePlugin({
//         $: "jquery",
//         jQuery: "jquery",
//         "windows.jQuery": "jquery"
//       })
//     ]
//   }
// })

// const { defineConfig } = require('@vue/cli-service')
// const webpack = require("webpack");
//
// module.exports = defineConfig({
//   devServer: {
//     // 端口号配置
//     port: 20000,
//     // 允许通过局域网/外网访问
//     host: '0.0.0.0',
//     // 允许任意 Host 头（包括你自定义的 buqiu.icu）
//     allowedHosts: 'all',
//     proxy: {
//       // 代理 /api 到后端服务
//       '/api': {
//         target: 'http://127.0.0.1:8888', // 后端地址
//         changeOrigin: true,
//         pathRewrite: { '^/api': '/api' }
//       },
//       // 图片等资源代理
//       '/img': {
//         target: 'http://127.0.0.1:8888',
//         changeOrigin: true,
//         pathRewrite: { '^/img': '' }
//       }
//     }
//   },
//   transpileDependencies: true,
//   lintOnSave: false,
//   configureWebpack: {
//     plugins: [
//       new webpack.ProvidePlugin({
//         $: "jquery",
//         jQuery: "jquery",
//         "windows.jQuery": "jquery"
//       })
//     ]
//   }
// })

