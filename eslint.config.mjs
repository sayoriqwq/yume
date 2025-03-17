import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  rules: {
    'react-dom/no-missing-button-type': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'no-console': 'off',
    'react-dom/no-dangerously-set-innerhtml': 'warn',
    'react/prefer-destructuring-assignment': 'warn',
  },
})
