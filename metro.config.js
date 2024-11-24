const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    assetExts: assetExts.concat(['png', 'jpg', 'jpeg']),
    sourceExts: sourceExts.concat(['js', 'jsx', 'json', 'ts', 'tsx']),
    resolverMainFields: ['react-native', 'browser', 'main'],
  },
};

module.exports = config;