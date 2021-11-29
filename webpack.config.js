const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

//! this is not needed after webpack v4.x; however, we use it to be more specific about how webpack will work
//* basic configuration include three properties: entry, output, and mode.
//* entry - entry point to root of the bundle and the start of the dependency graph; it is the relative
//* path to the client's code to be bundled.
//* output - receives the boudled code in 'filename' and places it in the 'dist' folder.
//* plugins -  Whenever you work with libraries that are dependent on the use of a global variable, just like jQuery
//* is with $ and jQuery, you must tell webpack to make exceptions for these variables by using webpack.ProvidePlugin.
//* mode - 'production' (default) or 'development'
module.exports = {
   entry: {
      app: './assets/js/script.js',
      events: './assets/js/event.js',
      schedule: './assets/js/schedule.js',
      tickets: './assets/js/tickets.js',
   },
   output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
   },
   module: {
      rules: [
         {
            test: /\.jpg$/i, //* process any image file with file extension .jpg ( can be extended to other ext. )
            use: [
               {
                  loader: 'file-loader',
                  options: {
                     esModule: false,
                     // get the actual file name and path instead of a hashed name
                     name(file) {
                        return '[path][name].[ext]';
                     },
                     publicPath: function (url) {
                        return url.replace('../', '/assets/');
                     },
                  },
               },
               {
                  loader: 'image-webpack-loader',
               },
            ],
         },
      ],
   },
   plugins: [
      new webpack.ProvidePlugin({
         $: 'jquery',
         jQuery: 'jquery',
      }),
      new BundleAnalyzerPlugin({
         // analyzerMode: 'disable', // opens the report in the browser
         analyzerMode: 'static', // the report outputs to an html file in the dist folder
      }),
   ],
   mode: 'development',
};
