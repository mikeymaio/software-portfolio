module.exports = {
  "env": {
    "browser": true,
    "es6": true,
  },
  "parser": "@babel/eslint-parser",
  "plugins": [
    "react",
  ],
  "globals": {
    "graphql": false,
  },
  "parserOptions": {
    "sourceType": "module",
    "requireConfigFile": false,
    "ecmaFeatures": {
      "jsx": true,
    },
    "babelOptions": {
      "presets": ["@babel/preset-react"]
    }
  }
}
