# This is a webpack configuration
## webpack版本：5.33.2
## 打包基本配置
  + webpack：以webpack.config.js为配置文件打包
  + webpack --config=dev.config.js：以dev.config.js为配置文件打包
### css
  + style-loader
  + css-loader
  + 在css-loader中使用importLoaders属性，表示在一个css文件中引用另一个css也会执行后面的loader

### scss
  + style-loader
  + css-loader
  + sass-loader
  + 需要安装的包：scss, node-sass, sass-loader

### less
  + style-loader
  + css-loader,
  + less-loader
  + 需要安装的包：less, less-loader
  + 生成的css代码是以style标签插入到文档中的

### 将css文件分离为一个文件
  + mini-css-extract-plugin插件负责提取css代码为一个单独的文件
  + 此时不再需要style-loader，而是将loader列表中的第一个修改为loader: MiniCssExtractPlugin.loader
  + 同时在插件中也要生成实例

### 压缩css代码
  + 即使是production模式下生成的css文件也不会进行压缩，压缩css需要额外的插件
  + css-minimizer-webpack-plugin
  + 默认生产环境下压缩css

    ```
      optimization: {
        minimizer: [
          new CssMinimizerPlugin()
        ]
      }
    ```

### 为css加上浏览器前缀
  + postcss-loader, autoprefixer
  + 有两种配置方法，第一种是直接在webpack.config.js中配置，在css-loader之后加上{ loader: 'postcss-loader', options: { postcssOptions: {plugins: [require('autoprefixer')]}}}
  + 第二种方式：新建postcss.config.js

    ```
      // postcss.config.js
      module.exports = {
        plugins: [require('autoprefixer')]
      }
    ```
  + postcss是根据.browserslistrc来进行配置

### img
  + webpack5废弃了url-loader，改用asset modules处理图片等资源
  + 图片压缩：ImageMinimizerWebpackPlugin
    ```
    {
      test: /\.[png|jpe?g|gif|svg]$/,
      type: 'asset/resource'  // 发送文件至打包文件夹
      type: 'asset/inline'  // 导出资源的data-url
      type: 'asset/source'  // 导出资源的源代码
      type: 'asset'  // 在导出资源的data-url和发送文件至打包文件夹之间自动选择，小于8kb的视为inline，大于8kb的视为resource。数字也可以自己设置。
    }
    ```
  + 修改文件名和文件目录：默认文件名为[hash][ext][query]，有两种方法进行自定义文件名和目录

  ```
    // 法1
    output: {
      assetModuleFilename: 'images/[hash][ext][query]
    }
    // 法2
    module: {
      rules: [
        test: /\.(png|jpe?g|gif|svg)$/
        type: 'asset/resource'
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      ]
    }
  ```

### 字体
  + asset modules
    ```
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource'
    }
    ```

### 数据json, csv, tsv, xml等
  + json是内置支持的，不需要配置
  + csv, tsv需要配置csv-loader
  + xml需要配置xml-loader

## 输出管理
  + html-webpack-plugin
  + clean: true
  + webpack5输出默认采用箭头函数，若想适配ie，需要关闭

    ```
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        environment: {
          arrowFunction: false
        }
      }
    ```

## 开发环境
### source map
  + source map用于生成打包文件和原始文件之间的映射，如果代码报错的化，source map可以帮助我们找到源代码报错的位置
  + 配置方式：devtool: 'source-map'

### 热更新
  + 代码发生变化后自动更新代码，而不必手动重新打包
  + watch mode
    + 在package.json中添加脚本 watch: webpack --watch, 运行npm run watch即可，监视代码的变化实时更新
    + 这种方式下，代码每发生变化就会自动打包一次，并将结果输出到dist文件夹下
  + webpack-dev-server
    + 安装webpack-dev-server
    + 在package.json中添加脚本start: webpack serve --open
    + 运行脚本
    + 修改代码之后，就会自动重新编译了， **但是并没有实时刷新是怎么回事**
    + 模块热替换
      + **官网的说法**
      + 只更新变更内容，以节省宝贵的开发时间
      + 在源代码中修改js/css之后，浏览器会立刻更新页面
      + **我用的结果**
      + 即使不使用模块热替换更新代码之后也不是全部资源重新打包，而是仅更新变更内容
      + 浏览器不会实时刷新，还需要自己手动刷新浏览器
    + contentBase属性：如果需要的资源不仅仅在src文件中，还有其他文件中的资源，此时就需要设置contentBase属性指向资源所在路径。默认情况下依赖的外部资源是不会热替换的，可以watchContentBase: true，来实现依赖资源的热替换，**但是没有任何作用是怎么回事**
    + proxy: 解决跨域问题

    ```
      devServer: {
        proxy: {
          '/api': {
            target: 'http://localhost:8000',  // 请求的服务器的地址,
            pathRewrite: {'^/api': ''},  // 请求地址不需要传递/api
            changeOrigin: true,  // 服务器会做一层验证，拒绝其它端口访问，设置这个属性之后就可以用其他端口对服务器进行访问了
            secret: false,  // 支持不具有证书的https服务器
          }
        }
      }
    ```
    + historyApiFallback：解决浏览器history模式返回404的问题。history模式返回404：如果采用前端路由的话，访问服务器的/路径会返回该页面的所有信息，但是如果直接访问/category页面，服务器没有这个路径，因此会返回404。将historyApiFallback设置为true之后，所有的404页面均会返回index.html。

## 代码分离
 + 代码分离的三种方法：1、通过配置不同的入口；2、防止重复使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk；3、动态导入：通过模块的内联函数调用来分离代码。

### 入口起点
  + 通过配置不同的入口来实现代码分离，但这种方式存在一定的隐患
    + 如果入口chunk之间包含一些重复的模块，这些模块会被打包多次
    + 不够灵活，并且不能动态地将核心应用程序逻辑中的代码拆分出来

### 防止重复
  + 在entry中配置dependOn option选项，可以在多个chunk之间共享模块
  + 这种方式还需要配置optimization.runtimeChunk: 'single'，这句话的作用是为每一个chunk创建一个runtime bundle
    ```
      entry: {
        index: {
          import: './src/main.js',
          dependOn: 'shared'
        },
        another: {
          import: './src/another.js',
          dependOn: 'shared'
        },
        shared: 'lodash'
      }，
      optimization: {
        tuntimeChunk: 'single'
      }
    ```
### SplitChunksPlugin
  + 将公共的依赖模块提取到已有的入口chunk中，或者提取到一个新生成的chunk中
  + 这个模块默认将异步引入的代码提取为一个新的chunk，经过上方的条件后，进入cacheGroups缓存，再决定打包方式

### 动态导入
  + import()导入的模块，由于是异步的，因此会生成一个chunk，如果是第三方模块，splitChunks默认会将其打包进vendors模块。
  + import()函数经常和prefetch/preload一起使用。
  + prefetch: /* webpackPrefetch: true */，告诉浏览器等网络空闲时加载该模块
  + preload: /* webpackPreload: true */，告诉浏览器并行加载该模块

### bundle 分析
  + 代码分离后，分析输出模块
  + 官方分析工具：webpack --profile --json > stats.json启动官方分析工具，会在打包目录生成一个stats.json文件
  + 插件：webpack-chart, webpack-visualizer, webpack-bundle-analyzer, webpack bundle optimize helper, bundle -stats

### 打包速度分析
  + speed-measure-webpack-plugin
  + 分析整个打包总耗时和每个插件和loader的耗时情况
  + 但是一直报错是什么情况

  ```
    const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
    const smp = new SpeedMeasureWebpackPlugin()
    module.exports = smp.wrap(config)
  ```


## 缓存
  + 输出文件的文件名随文件内容变化而变化：filename: '[name].[contenthash].js'
  + contenthash不仅入口文件发生变化时会变化，入口文件引入的发生变化时也会改变
  + optimization.moduleIds: 'deterministic'，第三方包的contenthash不会随moduleId发生变化

## 环境变量
### webpack 设置环境变量
  + 在package.json中设置脚本为：webpack  --env goal=local --env production
  + 在webpcak.config.js中导出一个函数

    ```
      module.exports = env => {
        console.log(env)  // env: {  WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, production: true, glob: 'local'}
        return {
          mode: '',
          devtool: 'source-map',
          ...
        }
      }
    ```
  + 这样就在webpack中拿到设置的环境变量

### 在nodejs中设置环境变量
  + 在package.json的脚本中配置 set NODE_ENV=production&& node app.js，在app.js中process.env.NODE_ENV === 'production' // true。**注：&&前不能有空格**
  + cross-env库，在package.json的脚本中配置 cross-env NODE_ENV=production node app.js，在app.js中process.env.NODE_ENV === 'production' // true。

## 性能优化
### 通用环境
  + loader配置include, exclude字段，应用于最少的必要模块
  + 减少resolve.modules, resolve.extensions, resolve.mainFiles, resolve.descriptionFiles中条目数量
  + DllPlugin DllReferencePlugin抽离第三方模块，webpack打包时将不会对抽离的模块打包，而是会生成新的模块，需要自己引入。
  + thread-loader, 将loader放在独立的worker pool中运行
  + 配置缓存cache, use: 'babel-loader?cacheDirectore=true'，默认缓存在node_modules/.cache文件夹中。
  + 合理使用splitChunksPlugin

### 开发环境
  + 增量编译 watch mode
  + 在内存中编译 webpack-dev-server, webpack-hot-middleware
  + stats.toJson()加速，**这是干啥的？**
  + 合理配置devtool参数，官方推荐配置：devtool: 'eval-cheap-module-source-map'
    + false: 不生成source-map
    + eval: 不会生成source-map，但打包的结果会变为eval函数，变为eval函数的作用是在每一个eval的结尾都有一行注释，注释标明代码与源码的位置关系，相当于source-map
    + source-map: 会生成source-map文件
    + eval-source-map: 会生成source-map，但不会真的生成source-map文件。它是将source-map的内容转为base64内嵌在bundle.js中，这就不需要请求source-map文件了。
    + inline-source-map: 不会生成source-map文件，内联在bundle.js中
    + cheap-source-map: 生成source-map文件，但没有列映射
    + cheap-module-source-map：类似于cheap-source-map，更加准确
  + 避免在开发环境下才会用到的工具
  + 最小化entry trunk，**没搞懂官方的意思**
  + 避免额外的优化步骤，webpack会默认开启一些优化算法(如removeAvaliableModules, removeEmptyChunks, splitChunks等)，这些优化适用于小型代码库，在大型代码库中非常耗费性能
  + 输出结果不携带路径信息，在output中设置pathinfo: false，**生成文件有变化吗？**
  + 在ts-loader中传入transpileOnly: true选项，这会关闭类型检查来缩短构建时间。如果想再次开启类型检查，使用ForkTsCheckerWebpackPlugin，这个插件的作用是将检查过程移至单独的进程，加快TS的类型检查和ESLint插入的速度。

    ```
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              }
            }
          ]
        }
      ]
    }
    ```
### 生产环境
 + **官方建议：不要为了很小的性能收益，牺牲应用程序的质量！在大多数情况下，优化代码质量比构建性能更重要。**
 + TerserPlugin，并行压缩代码,webpack5自带插件，不需要安装
 + parallel-webpack
 + 不再需要source-map

    ```
      optimization: {
        minimizer: [
          new TerserPlugin({
            parallel: true,
            cache: true
          })
        ]
      }
    ```

### tree shaking
  + 只有ES6模块的导入导出才能tree shaking
  + 有些模块是不需要tree shaking的，因此需要在package.json中配置sideEffects属性，指明哪些文件是有副作用的
  + 在生产模式下自动启动tree shaking
  + css tree shaking: purgecss-webpack-plugin + mini-css-extract-plugin配合使用

## shimming
  + 预制全局变量
    ```
      const webpack = require('webpack')
      module.exports = {
        plugins: [
          new webpack.ProvidePlugin({
            _: 'lodash'
          })
        ]
      }
    ```  
+ 这样就预制了全局变量_指向lodash
  ```
    const webpack = require('webpack')
    module.exports = {
      plugins: [
        new webpack.ProvidePlugin({
          join: ['lodash', 'join']
        })
      ]
    }
  ```
+ 这样就预制了全局变量join指向lodash.join，注意这种方式仅仅导入lodash模块的join方法而不是导入整个模块


## babel
  + 需要安装的模块
    + babel-loader
    + @babel/core
    + @babel/preset-env
    + @babel/plugin-transform-runtime
    + core-js
    + 需要配置.babelrc
  + 配置流程
    + 在module中，将以.js结尾的文件以babel-loader进行处理
    + 新建.babelrc文件
      ```
      { 
        "presets": [
          [
            "@babel/preset-env",   // 预设是根据.browserslistrc文件来进行代码转换的
            { 
              "targets": {  // target属性是适配指定的浏览器
              "ie": 8, 
              "chrome": "80"
              }, 
              "useBuiltIns": "usage",   // 这个属性是使用profill的方式，false表示不使用；usage表示按需加载；entry表示全部加载，此时还需在入口文件下引入core-js和regenerator-runtime
              "corejs": 3  // 指明core-js版本
            } 
          ]
        ] 
      }
    ```
## vue2
  + vue
  + vue-loader
  + vue-template-compiler

    ```
      const VueLoaderPlugin = require('vue-loader/lib/plugin')
      module.exports = {
        module: {
          test: /\.vue$/,
          use: 'vue-loader'
        },
        plugins: [
          new VueLoaderPlugin()
        ]
      }
    ```

## webpack打包原理
### webpack打包流程
  + webpack就像一条生产线，要经过一些列处理流程之后才能将源文件转换成输出结果。这条生产线上的每个处理流程的职责都是单一的，多个流程之后存在依赖关系，只有完成当前处理后才能交给下一个流程去处理。webpack在运行的过程中会广播事件，插件只需要监听它所关心的事件，就能加入到生产线中，去改变生产线的运作。
  + webpack构建流程
    + webpack最核心的功能就是将各种类型的资源转译、组合、拼接、生成JS格式的bundler文件。在这个过程中完成了**内容转换 + 资源合并**两种功能，实现上包含三个阶段。
    + **初始化阶段**
    + 初始化参数，从配置文件和shell语句中读取与合并参数，得出最终的参数。
    + 创建编译器对象：由参数创建Compiler对象
    + 初始化编译环境：将所有内置插件和自己配置的插件全部实例化，并通过实例化方法apply挂载到compiler上不同的hooks上
    + 开始编译：执行Compiler对象的compiler方法进入编译环节。然后先触发compiler.hooks.beforeCompiler钩子，再触发compiler.hooks.compiler钩子，然后新建Compilation实例。再compilation创建的过程中，会触发compiler.hooks.compilation钩子。
    + 确定入口：根据entry找出所有的入口文件，调用compilition.addEntry将入口文件转换为dependence对象
    + **构建阶段**
    + 编译模块(make)：根据entry对应的dependence创建module对象，调用loader将模块转译为标准JS内容，调用JS解释器将内容转换为AST对象，从中找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
    + 完成模块编译：上一步递归处理所有能触达到的模块后，得到了每个模块被翻译后的内容以及他们之间的依赖关系图
    + **生成阶段**
    + 输出资源(seal）：make阶段结束后，compilation调用seal方法进入seal阶段，会触发compilation.hooks.seal, compilation.hooks.optimize, compilation.hooks.optimizeTree等钩子，Tree Shaking，Code Spliting，代码压缩等都是在此阶段完成的。根据入口和模块之间的依赖关系，组装成一个个包含多个模块的chunk，再把每个chunk转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会。然后进入emit阶段
    + 写入文件系统：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。
  + 名词解释
    + Compiler：编译管理器，管理webpack的编译流程
    + compilication：单次编译过程管理器
    + Dependence：依赖对象，记录模块之间的依赖关系

### 插件
  + 要了解webpack插件首先要了解tapable，tapable是一个事件定义和触发的库
  + 基本使用：
  ```
    const { SyncHook } = require('tapable')
    const hook = new SyncHook(['name'])  // 创建实例，其中name表示这个实例定义的事件接受一个参数
    hook.tap('hello', name => {  // 给实例添加事件，hello为事件名，name为参数
      console.log(`hello ${name}`)
    })
    hook.tap('hello again', name => {
      console.log(`hello again ${name}`)
    })

    hook.call('zhangsan') // hello zhangsan \n hello again zhangsan
  ```
  + 除了SyncHook钩子之外，同步钩子还有SyncBaikHook, SyncWaterfallHook, SyncLoopHook
  + SyncBailHook: 回调函数返回非undefined，停止执行下面的回调
  + SyncWaterfallHook: 至少接收一个参数，上一个回调的返回值会作为下一个回调函数的参数，如果上一个回调没有返回值，则参数为输入的参数
  + SyncLoopHook: 在执行过程中回调返回非undefined时，继续再次执行当前回调，因此如果有回调未返回undefined，那么会一直执行这个回调
  + 除了同步钩子之外，还有异步钩子
  + 同步钩子只能通过tap注册事件，通过call执行事件。异步钩子有三种事件注册方式：tap, tapAsync, tapPromise, 不同的注册方式有不同的触发方式
  + tapAsync触发方式：callAsync；tapPromise触发方式：promise

    ```
      const { AsyncParallelHook } = require('tapable')
      const hook = new AsyncParallelHook(['arg1', 'arg2', 'arg3'])
      hook.tapAsync('event1', (arg1, arg2, arg3, callback) => {
        console.log(arg1, arg2, arg3)
        callback()  // callback()是在触发时传入的函数
      })
    ```
  + 异步钩子还有串行、并行两种模式AsyncParallelHook: 并行，AsyncSeriesHook：串行
  + **什么是插件？**
  + 插件是一个带有apply方法的类
  + 开发一个最简单的插件

  ```
    // demo.js
    class Demo {
      apply() {
        console.log('Hello World')
      }
    }
    module.exports = Demo
  ```
  + 在插件中获取参数

  ```
    // demo.js
    class Demo {
      constructor(options) {
        this.options = options
      }

      apply() {
        console.log(this.options)
      }
    }
  ```
  + 在apply方法中获取compiler对象
  ```
    // demo.js
    class Demo {
      constructor(options) {
        this.options = options
      }

      apply(compiler) {
        console.log(this.options)
      }
    }
  ```
  + webpack启动后，在读取配置的过程中会先执行 new Demo(options)初始化一个插件实例。在初始化compiler对象之后，再调用Demo.apply(compiler)方法。实例获取到comipler对象之后，就可以可以调用hook对象注册各种钩子回调，例如：compiler.hooks.make.tapAsync，这里面make是钩子名称，tapAsync定义了钩子的调用方式。webpack的各种内置对象都有hooks属性，比如compilation对象。
  ```
    class SomePlugin {
      apply(compiler) {
        compiler.hooks.thisComilation.tap('SomePlugin', compilation => {
          compilation.hooks.optimizeChunkAssets.tapAsync('SomePlugin', () => {})
        })
      }
    }
  ```
### Loader
  + loader是一个js模块，该模块导出一个函数，作用是将输入内容处理并输出
  + 最简单的loader

  ```
    module.exports = function(respurce) {
      return resource
    }
  ```
  + 上面的那个loader啥也没干，怎么输入的就怎么输出
  + 下面实现一个去除JS代码单行注释的loader

  ```
    module.exports = function(resource) {
      const reg = /\/{2,}.*\r\n/g
      return resource.replace(reg, '')
    }
  ```
  + 本地loader测试方法：
  + 法1、使用loader-runner

  ```
    // index.js
    const fs = require('fs')
    const path = require('path')
    const { runLoaders } = require('loader-runner')
    runLoaders({
      resource: path.resolve(__dirname, "demo.js"),
      loaders: [path.resolve(__dirname, "loader.js")],
      readResource: fs.readFile.bind(fs)
    }, (err, res) => {
      err ? console.log(err) : console.log(res)
    })
  ```
  + 法2、在webpack.config.js中配置resolveLoader属性，指向存在loader的地址
  ```
    resolveLoader: {
      modules: ['node_modules', './src/loader']
    }
  ```
  + loader参数获取：loader-utils的getOptions方法可以获取参数
  
  ```
    const loaderUtils = require('loader-utils')
    module.exports = function(resource) {
      const options = loaderUtils.getOptions(this)
      return resource
    }
  ```
  + loader异步处理

  ```
    const callback = this.async()
  ```
  + 处理二进制数据：默认情况下loader的resource参数为字符串，有些情况下，需要传入二进制数据

  ```
    module.exports.raw = true  // 这句话表明当前loader需要二进制数据
  ```
  + 缓存：loader默认开启缓存

  ```
    this.cacheable(false)  // 关闭缓存
  ```
  + loader还有许多其他的api，通过console.log(this)即可查看