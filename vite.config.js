import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
  const isUserSite = repoName.endsWith('.github.io')

  return {
    base: isGitHubActions ? (isUserSite ? '/' : `/${repoName}/`) : '/',
    plugins: [react()],
  }
})
