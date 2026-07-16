# Deploy dist/ to GitHub Pages branch gh-pages
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$dist = Join-Path $root "dist"
$repo = "git@github.com:flowerwithwind/personal-dev-website.git"
$tmp = Join-Path $env:TEMP "personal-site-gh-pages-deploy"

if (-not (Test-Path $dist)) {
  throw "dist/ missing — run npm run build first"
}

if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
New-Item -ItemType Directory -Path $tmp | Out-Null
Copy-Item -Recurse -Force (Join-Path $dist '*') $tmp

Push-Location $tmp
try {
  git init
  git checkout -b gh-pages
  git add -A
  git -c user.name="site-deploy" -c user.email="deploy@local" commit -m "Deploy personal site"
  git remote add origin $repo
  git push -f origin gh-pages
  Write-Host "Pushed gh-pages to $repo"
  Write-Host "Public URL: https://flowerwithwind.github.io/personal-dev-website/"
} finally {
  Pop-Location
}
