// babel.config.js
module.exports = {
  plugins: ['@babel/plugin-syntax-class-properties'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};
