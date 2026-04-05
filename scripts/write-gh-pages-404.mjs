import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const distDir = resolve(process.cwd(), 'dist')
const indexPath = resolve(distDir, 'index.html')
const fallbackPath = resolve(distDir, '404.html')
const noJekyllPath = resolve(distDir, '.nojekyll')

const repository = process.env.GITHUB_REPOSITORY ?? ''
const repoName = repository.split('/')[1] ?? ''
const isUserSite = repoName.endsWith('.github.io')
const pathSegmentsToKeep = isUserSite ? 0 : 1

if (!existsSync(distDir) || !existsSync(indexPath)) {
  throw new Error('Build output not found. Run "vite build" before generating the GitHub Pages fallback.')
}

mkdirSync(distDir, { recursive: true })

const fallbackBootstrap = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting...</title>
    <script>
      (function () {
        var pathSegmentsToKeep = ${pathSegmentsToKeep};
        var locationData = window.location;
        var repoPath =
          locationData.pathname
            .split('/')
            .slice(0, 1 + pathSegmentsToKeep)
            .join('/') || '/';
        var routePath = locationData.pathname
          .slice(repoPath.length)
          .replace(/^\\//, '');
        var nextPath =
          repoPath +
          (routePath ? '/' + routePath : '/') +
          locationData.search +
          locationData.hash;

        sessionStorage.setItem('gh-pages-spa-path', nextPath);
        window.location.replace(repoPath + '/');
      })();
    </script>
  </head>
  <body></body>
</html>
`

writeFileSync(fallbackPath, fallbackBootstrap, 'utf8')
writeFileSync(noJekyllPath, '', 'utf8')
