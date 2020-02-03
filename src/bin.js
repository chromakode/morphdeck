#!/usr/bin/env node
const path = require('path')
const {readFile} = require('fs').promises
const yargs = require('yargs')
const {DOMParser} = require('xmldom')
const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const IgnoreEmitWebpackPlugin = require('ignore-emit-webpack-plugin')

async function readSVGMetadata(svg) {
  const svgText = await readFile(svg, 'utf8')
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, 'text/xml')

  let title = 'Presentation'
  const titleEl = doc.getElementsByTagName('title')[0]
  if (titleEl) {
    title = titleEl.textContent
  }
  return {title}
}

function generateWebpackConfig({mode, svg, js, title}) {
  const isProduction = mode === 'production'
  const svgoLoader = {
    loader: 'svgo-loader',
    options: {
      plugins: [
        {cleanupIDs: {
          preservePrefixes: ['slide', 'deck'],
        }},
        // Keep group structure (which may be used for transforms)
        {collapseGroups: false},
        {moveElemsAttrsToGroup: false},
        {moveGroupAttrsToElems: false},
        {removeHiddenElems: false},
        {removeTitle: false},
        {removeViewBox: false},
      ],
    },
  }

  // Compile away nanohtml template strings in prod.
  const babelRule = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        plugins: [
          [require.resolve('nanohtml'), {useImport: true}],
        ],
      },
    },
  }

  const resolve = {
    modules: [
      // Relative to deck
      'node_modules',

      // Relative to this module (so zero-config users
      // don't need to npm install nanohtml, etc.)
      path.resolve(__dirname, '../node_modules'),
    ],
  }

  return {
    entry: js || path.resolve(__dirname, 'default-deck.js'),
    output: {
      filename: 'index.js',
      path: process.cwd(),
    },
    mode,
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: [
            'raw-loader',
            isProduction && svgoLoader,
          ].filter(Boolean),
        },
        {
          test: /\.woff$/,
          use: 'url-loader',
        },
        isProduction && babelRule,
      ].filter(Boolean),
    },
    resolve: {
      ...resolve,
      alias: {
        // Avoid being shadowed by a global installation
        'svg-morph-deck': path.resolve(__dirname, 'index.js'),
        'deck.svg': svg,
      },
    },
    resolveLoader: resolve,
    plugins: [
      new HtmlWebpackPlugin({
        title,
        filename: path.parse(svg).name + '.html',
        inlineSource: '.js$',
      }),
      isProduction && new HtmlWebpackInlineSourcePlugin(),
      isProduction && new IgnoreEmitWebpackPlugin('index.js')
    ].filter(Boolean)
  }
}

async function serve({svg, js, host, port}) {
  const {title} = await readSVGMetadata(svg)
  const mode = 'development'

  const webpackConfig = generateWebpackConfig({mode, svg, js, title})
  const compiler = Webpack(webpackConfig)

  // TODO: serve index at deck.html
  const devServerOptions = {
    host,
    port,
    index: 'deck.html',
    publicPath: '/',
    stats: {
      colors: true,
    },
  }
  const server = new WebpackDevServer(compiler, devServerOptions)

  server.listen(port, host)
}

async function build({svg, js}) {
  const {title} = await readSVGMetadata(svg)
  const mode = 'production'

  const webpackConfig = generateWebpackConfig({mode, svg, js, title})
  const compiler = Webpack(webpackConfig)
  compiler.run((err, stats) => {
    if (err) {
      console.error(err)
      return
    }
    if (stats.hasErrors()) {
      console.error(stats.toJson().errors.join('\n'))
    }
  })
}

function main() {
  yargs
    .command(['serve <svg> [js]', '$0'], 'serve locally and live reload', yargs => {
      yargs
        .positional('svg', {
          describe: 'path to deck svg file',
          normalize: true,
        })
        .positional('js', {
          describe: 'path to customization js file',
          normalize: true,
        })
        .option('host', {
          describe: 'host to bind on',
          default: 'localhost',
        })
        .option('port', {
          describe: 'port to bind on',
          default: 5000,
        })
    }, serve)
    .command(['build <svg> [js]'], 'build into a single static html file', yargs => {
      yargs
        .positional('svg', {
          describe: 'path to deck svg file',
          normalize: true,
        })
        .positional('js', {
          describe: 'path to customization js file',
          normalize: true,
        })
    }, build)
    .coerce(['svg', 'js'], path.resolve)
    .argv
}

main()


// package.json engines field
// shorthand for implementing entrance effects
// appear in order w/ generateSlides before custom one
// pluggable list of generateSlides ops like appear?
// mobile ui
// play enter/exit effect backwards when reversing


// figma and illustrator howtos
// auto embed fonts
// accessibility
// don't morph anything with a different transform but no key
// hide cursor after timeout
// find and scoop up all 'use's, put in slide object and add to defs when needed
// catch dupe keys
// determine which transforms are static and bake in on build
// whole slide transitions (pop in, etc)


// done
// hyperlinks?
// remove inkscape/sodipodi props
// present mode: start at current slide if not 1
// exit effects
// compile away nanohtml using webpack
// index.html
// simplify config
// remove default fonts from css
// nanocomponent timer
// build mode
// pop out child view
// remote control / speaker view
// parent node w/ no animations
// notes in svg?
// replace bg with texture, SVG global bg color
// generator for slides -- done, works great
// configure individual slides? -- done, slide object
// how to make entry animation separate from transition -- enter-effect works
// hot reload -- hard reload works fine
// sort slides by horizontal position, make configurable? -- layers is better and has less transform weirdness
// multiple steps per slide -- handleable with generator, maybe add an attribute
// hook on slide show -- maybe not? stateless is useful
// individual slide.render override
// get rid of parentNode config
