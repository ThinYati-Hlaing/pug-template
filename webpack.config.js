const path = require('path');
const fs = require('fs');
const PugPlugin = require('pug-plugin');

const pages = fs
  .readdirSync('./src/pages')
  .filter((fileName) => fileName.endsWith('.pug'))
  .reduce((acc, fileName) => {
    // Get the base name of the file without the extension
    const baseName = path.basename(fileName, '.pug');
    // Add to the accumulator object
    acc[baseName] = `./src/pages/${fileName}`;
    return acc;
  }, {});

module.exports = {
  output: {
    path: path.join(__dirname, 'dist/')
  },
  plugins: [
    new PugPlugin({
      entry: pages,
      js: {
        // JS output filename with hash for unique id
        filename: 'js/[name].[contenthash:8].js'
      },
      css: {
        // CSS output filename with hash for unique id
        filename: 'css/[name].[contenthash:8].css'
      },
      pretty: 'auto' // Format HTML in development mode only
    })
  ],
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: ['css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|jpeg|ico)/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name].[hash:8][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext][query]'
        }
      }
    ]
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    // Enable live reload
    watchFiles: {
      paths: ['src/**/*.*', 'styles/**/*.*'],
      options: {
        usePolling: true
      }
    }
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.scss', '.sass', '.min.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@scripts': path.resolve(__dirname, 'src/scripts'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  },
  stats: 'errors-only'
};
