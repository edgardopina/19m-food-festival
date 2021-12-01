const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const WebpackPwaManifest = require('webpack-pwa-manifest'); //* import 'webpack-pwa-manifest' plugin

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
            test: /\.jpg|png|gif|svg$/i, //* process any image file with file extension .jpg ( can be extended to other ext. )
            use: [
               {
                  loader: 'file-loader',
                  options: {
                     esModule: false,
                     //* get the actual file name and path instead of a hashed name
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
         // analyzerMode: 'disable', //* opens the report in the browser
         analyzerMode: 'static', //* the report outputs to an html file in the dist folder
      }),
      //! webpack manifest - PWA
      new WebpackPwaManifest({
         //*  name that will show up next to the app's icon on desktop devices
         name: 'Food Event',
         //* name that will appear on a user's home screen when the application has been downloaded
         short_name: 'Foodies',
         description: 'An app that allows you to view upcoming food events.',
         start_url: '../index.html', //* PWA homepoage relative to the location of manifest file
         background_color: '#01579b',
         //* sets the color of the tool bar. This color may also show up if the user is switching tasks
         theme_color: '#ffffff',
         //* Fingerprints tell webpack whether or not it should generate unique fingerprints so that each time a
         //* new manifest is generated, it looks like this: manifest.lhge325d.json. Because we do not want this
         //* feature, we set fingerprints to be false.
         fingerprints: false,
         //* The inject property determines whether the link to the manifest.json is added to the HTML. Because we
         //* are not using fingerprints, we can also set inject to be false.We will hardcode the path to the manifest.json
         //* instead, just like we would in an application without webpack.
         inject: false,
         //* The icon is the button that users will see on their home screen after installing the client's application
         icons: [
            {
               //* path to the icon image we want to use
               src: path.resolve('assets/img/icons/icon-512x512.png'),
               //* take the src image, and create icons with the dimensions of the numbers provided as the value of the sizes property
               sizes: [96, 128, 192, 256, 384, 512],
               //* where the icons will be sent after the creation of the web manifest is completed by the plugin
               destination: path.join('assets', 'icons'),
            },
         ],
      }),
   ],
   mode: 'development',
};
