import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  rules: {
    'react-dom/no-missing-button-type': 'off',
    'react-dom/no-dangerously-set-innerhtml': 'warn',
    'react/prefer-destructuring-assignment': 'warn',
  },
})
