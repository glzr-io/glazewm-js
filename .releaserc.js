module.exports = {
  branches: ['main', { name: 'develop', prerelease: 'next' }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    [
      '@semantic-release/github',
      {
        successComment: false,
        // Create a draft release for manual approval on push to 'main'.
        draftRelease: process.env.BRANCH_NAME === 'main',
      },
    ],
  ],
};
