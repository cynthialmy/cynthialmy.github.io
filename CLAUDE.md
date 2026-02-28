# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Local development:**
```bash
bundle install                                      # Install Ruby gem dependencies
bundle exec jekyll serve --host 127.0.0.1 --port 4001 --no-watch  # Serve locally
bundle exec jekyll serve                            # Serve with live reload (default port 4000)
bundle exec jekyll build                            # Build static site to _site/
```

**CI build (matches GitHub Actions):**
```bash
bundle exec appraisal jekyll build --future --config _config_ci.yml,_config.yml
```

The `--future` flag is required to include future-dated posts that exist in `_posts/`.

## Architecture

This is a Jekyll static site using the **Beautiful Jekyll** theme (v6.0.1), deployed to GitHub Pages via GitHub Actions (`.github/workflows/ci.yml`).

### Key configuration
- `_config.yml` — main site config: navbar links, social links, custom taxonomy (`project_types`, `portfolio_types`), color scheme, permalink structure (`/:year-:month-:day-:title/`)
- `_config_ci.yml` — CI-specific overrides (used only in GitHub Actions builds)
- `staticman.yml` — comment system config (currently disabled)

### Content structure
- `_posts/` — published blog posts (case studies, articles), named `YYYY-MM-DD-title.md`
- `_post_drafts/` — unpublished drafts (not processed by Jekyll by default)
- `index.html` — homepage using `home` layout (featured project cards with filtering)
- `projects.md` — portfolio page with filterable project grid
- `about.md`, `connect.md` — static pages

### Layouts & templates
- `_layouts/base.html` → `default.html` → `page.html` / `post.html` / `home.html` (inheritance chain)
- `_layouts/minimal.html` — standalone layout with no nav/footer
- `_includes/` — 27 partials for head, nav, footer, analytics, social sharing, comments

### Custom extensions (beyond the theme)
- `assets/css/custom.css` — all site customizations: Google Fonts (DM Serif Display, DM Sans), hero section, project cards with hover effects, project-type badge colors, responsive breakpoints
- `assets/js/project-filters.js` — client-side filtering for the portfolio page by `project_types` taxonomy
- `_layouts/home.html` — custom homepage layout with filter bar and project type badges

### Post front matter
Posts support these custom fields beyond standard Jekyll:
- `project_type:` — used for portfolio filtering (values: `enterprise`, `zero-to-one-builds`, `other`)
- `portfolio_type:` — secondary taxonomy (`technical-projects`, `research-analysis`)
- `thumbnail-img:` — card image for the homepage grid
- `tags:` — displayed on cards and used for the tags index page (`tags.html`)

### Assets
- `assets/img/` — all images (78 files); portfolio screenshots, nav logo, social icons
- `assets/data/` — data files served statically
- `resources/` — PDFs and templates (resume, product-thinking-template)
- `_site/` — generated output, excluded from git
