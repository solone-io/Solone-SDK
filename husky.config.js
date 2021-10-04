module.exports = {
  hooks: {
    'pre-commit': 'yarn pre-commit',
    'pre-push': 'yarn coverage',
  },
};
