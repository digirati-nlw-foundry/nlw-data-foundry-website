# NLW Data Foundry Website

Astro site for the NLW Data Foundry experience.

## Git repositories

Use this checkout for website work. The remotes share history:

| Remote | Repository | Role |
| :----- | :--------- | :--- |
| `staging` | `digirati-nlw-foundry/nlw-data-foundry-website` | Client staging and integration base |
| `dev` | `digirati-co-uk/nlw-data-foundry-website-dev` | Public development fork; default push destination |
| `origin` | `digirati-co-uk/nlw-data-foundry-website` | Original repository |

Local `main` tracks `staging/main`. Refresh work is on `feature/refresh-staging`,
rebased onto staging with its content preserved. Earlier local branches are kept
for reference, including `archive/*`; they are not integration sources.

Fetch all remotes before integrating new client changes. With a clean working
tree, rebase the feature branch onto staging and push it to the public fork:

```sh
git fetch --all
git rebase staging/main
git push -u dev HEAD
```

Pushes default to `dev`. Promotion to client staging requires an explicit remote.
Review changes before publishing to the public fork.

## Develop with the Foundry admin

Run `make local` or `make e2e` from the sibling Foundry repo. Its `WEBSITE_SOURCE`
setting can point to this checkout; otherwise it reuses the sibling or clones the
development website into Foundry's `var/website/`. See the
[Foundry runbook](../nlw-data-foundry/tools/local/README.md) for setup and credentials.

`make local` watches this repo's source while using persistent mock content outside
this checkout. E2E uses a disposable source snapshot and content. Stop the mock
stack with `make local-down`; E2E cleans up automatically. `make develop` and
`make develop-down` remain Foundry's admin-only real GitHub commands; Netlify
builds and serves the website. Committing, pushing and pulling here remain your
normal Git workflow.

The Docker development image keeps dependencies, `.astro`, `.iiif` and build output
in environment-owned storage. No mock commits or generated files are written here.
Foundry uses Astro's native dev server; source edits sync, restart it, and reload
the browser. Production builds retain the Netlify adapter.
The development site's Pagefind index follows published content; PR previews have
their own index built from the PR commit.

Astro collections accept `CONTENT_ROOT`, defaulting to `./src/content`, for an
alternative directory containing `data-cards/`, `pages/` and `exhibitions/`:

```sh
CONTENT_ROOT=/path/to/local/content pnpm dev
```

IIIF-HSS reads `./iiif-config` by default. Set `IIIF_CONFIG_DIR` to use another
directory containing `config.yml`, `stores/`, and `config/`:

```sh
IIIF_CONFIG_DIR=/path/to/iiif-config pnpm dev
```

The dependency patch lets the integration's `configFile` option accept this
directory and watch new store declarations during development.

Foundry supplies its Compose Watch image and native Astro configuration wrapper,
so an ordinary website checkout can be used without adding Docker files. The
standalone `Dockerfile.local` also remains available. Frozen installs include the
workspace settings and dependency patches. `pnpm test:local` checks content paths
and IIIF integration.

## Commands

All commands run from the repository root.

| Command | Action |
| :------ | :----- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start the Astro development server for layout and content work |
| `pnpm build:site` | Build the Astro site into `dist/` without generating the Pagefind index |
| `pnpm build` | Build the site and generate the production search index in `dist/pagefind` |
| `pnpm preview` | Build the site, generate the Pagefind index, and serve the built output locally on Pagefind's preview server |
| `pnpm astro -- --help` | Show Astro CLI help |

## Local Search Workflow

Search works locally in two ways:

1. Run `pnpm preview` on its own to serve the built site with the generated Pagefind index.
2. Run `pnpm dev` and `pnpm preview` together to test search inside the dev site. The dev server proxies `/pagefind/*` requests to the preview server.

To test search in the dev site, use two terminals:

```sh
# Terminal 1
pnpm dev

# Terminal 2
pnpm preview
```

By default `pnpm preview` serves the Pagefind-backed build at `http://localhost:1414`, and `pnpm dev` proxies `/pagefind/*` there.

If you only need to verify the generated assets, run:

```sh
pnpm build
```

Then confirm that `dist/pagefind/pagefind.js` exists.

If you need a different preview origin for the proxy, set `PAGEFIND_DEV_SERVER_URL` before starting `pnpm dev`.
