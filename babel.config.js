module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: false,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [['@babel/plugin-transform-runtime', { corejs: 3 }]],
  env: {
    test: {
      presets: ['@babel/env'],
    },
  },
}
