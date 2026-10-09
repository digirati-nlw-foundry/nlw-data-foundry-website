# NLW Data Foundry Website

Astro site for the NLW Data Foundry experience.

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
