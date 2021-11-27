const webpack = require("webpack");
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
   entry: './assets/js/script.js',
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.bundle.js',
   },
   plugins: [
      new webpack.ProvidePlugin({
         $: 'jquery',
         jQuery: 'jquery',
      }),
   ],
   mode: 'development',
};
