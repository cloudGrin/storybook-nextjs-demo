const withLess = require('next-with-less')
const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')(['antd'])

/** @type {import('next').NextConfig} */
const nextConfig = {}

const plugins = [
    [
      withLess,
      {
        lessLoaderOptions: {
          /* config for next-with-less */
          additionalData: (/** @type {any} */ content) => {
            return `${content}\n\n@import '${path.resolve('./antd-custom.less')}';`
          }
        }
      }
    ],
    withTM
  ]

module.exports = withPlugins(plugins, nextConfig)
