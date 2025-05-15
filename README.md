# Package Analyzer

TypeScript version of the package analyzer tools for Verdaccio NPM packages.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Place your package list in `input/package-list.md` (one package name per line)

## Usage

The tools are available as npm scripts:

1. Fetch dist-tags data:

```bash
pnpm run start:get-tags
```

2. Convert dist-tags to markdown report:

```bash
pnpm run start:convert-md
```

3. Generate version summary table:

```bash
pnpm run start:convert-summary
```

## Output

- Dist-tags JSON data is saved to [`data/dist-tags.json`](data/dist-tags.json)
- Markdown report is generated in [`output/dist-tags.md`](output/dist-tags.md)
- Summary table is generated in [`output/summary.md`](output/summary.md)
