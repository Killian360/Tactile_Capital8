const withPlugins = require('next-compose-plugins')
const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')
const withSvgr = require("next-svgr")

const nextConfig = {
  distDir: 'build/',
  exportPathMap: () => ({
      '/': { page: '/' },
  }),
  assetPrefix: process.env.ASSET_PREFIX || '',
  useFileSystemPublicRoutes: false
};

const cssConfig = {
  webpack: function (config) {
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]'
        }
      }
    })
    return config
  }
};

module.exports = withPlugins([
    [withImages],
    [withSvgr],
    [withSass],
    [withCSS]
  ],
  { ...cssConfig, ...nextConfig },
);
