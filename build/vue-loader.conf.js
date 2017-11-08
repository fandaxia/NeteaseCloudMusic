var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

const path = require('path')
const museUiThemePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'muse-ui',
  'src/styles/themes/variables/teal.less'
)
var a = utils.cssLoaders({
  sourceMap: isProduction ?
    config.build.productionSourceMap : config.dev.cssSourceMap,
  extract: isProduction
})
a.less = [
  'vue-style-loader',
  'css-loader',
  {
    loader: 'less-loader',
    options: {
      globalVars: {
        museUiTheme: `'${museUiThemePath}'`,
      }
    }
  }
]

module.exports = {
  loaders: a
}


// module.exports = {
//   loaders: utils.cssLoaders({
//     sourceMap: isProduction
//       ? config.build.productionSourceMap
//       : config.dev.cssSourceMap,
//     extract: isProduction
//   }),
postcss: [
  require('autoprefixer')({
    browsers: ['last 20 versions']
  })
]
//}
