
module.exports = () => {
  return {
    mode: 'production',
    entry: 'dist/index.js',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    }
  }
}