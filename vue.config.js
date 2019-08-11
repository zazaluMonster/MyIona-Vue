module.exports = {
  publicPath: '/MyIona/',
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            {
              loader: 'less-loader', // compiles Less to CSS
            },
          ],
        },
      ],
    }
  }
}