# my-website

Code for my personal website [matthewocallaghan.uk](https://www.matthewocallaghan.uk).

Built with [Eleventy](https://www.11ty.dev/) (Nunjucks templates + a JSON data cascade), Sass, PostCSS and esbuild, and deployed to GitHub Pages. Pushes to `master` auto-deploy via GitHub Actions (`.github/workflows/deploy.yml`).

## Development

```
npm install
npm run dev
```

This starts Eleventy's dev server with live reload at `http://localhost:8080`, alongside a Sass watcher.

## Building

```
npm run build
```

Builds the full production site into `dist/`: Eleventy renders the HTML, Sass compiles to CSS, PostCSS (autoprefixer + cssnano) and PurgeCSS minify/trim the CSS, and esbuild minifies the JS.

## Deployment

Deployment is automatic: merging to `master` triggers the GitHub Actions workflow, which builds the site and publishes `dist/` via GitHub Pages. The custom domain is configured via the `CNAME` file at the repo root; DNS for `matthewocallaghan.uk` is managed separately at Mythic Beasts (email/MX records are unaffected by this).
