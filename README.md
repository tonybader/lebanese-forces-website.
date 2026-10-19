# Lebanese Forces Website

The multilingual Lebanese Forces website, article archive, newsroom, media library, publications library and visual homepage editor. Arabic is the primary language, with English and French versions. The production application uses the Next.js App Router and is deployed on Vercel.

## Developer

This website is designed, developed and technically maintained by **Innovative Solutions**.

- Client and content owner: Lebanese Forces
- Website developer: Innovative Solutions
- Design, frontend and backend implementation: Innovative Solutions
- Technical architecture, deployment and maintenance: Innovative Solutions

## Main areas

- Public multilingual website with light and dark themes
- News, statements, MPs and ministers' positions, party activities and special articles
- Leadership, parliamentary bloc, ministerial bloc and public profile pages
- Interactive history and political positions
- Publications, legislative documents, photographs, songs and videos
- Editor workspace for articles, media and submissions
- Administrator workspace for homepage content and visual settings

## Management routes

- `/editor`: create, edit, pin and delete articles; manage tags, media and documents
- `/admin`: edit homepage text, images, leadership content, timelines and profile information
- `/editor/actions`: review participation requests
- `/editor/submissions`: review contact submissions and export them

Editor and administrator routes are protected by signed server-side sessions.

## Content storage

The management tools write approved content back to this repository:

- `data/articles.json`: articles and editorial metadata
- `data/homepage.json`: homepage and institutional content
- `data/media.json`: media and publication records
- `public/uploads/`: uploaded editorial images

Every successful save creates a repository commit. Public article lists are ordered by `publishedAt`, with pinned content handled separately by the application.

## Local development

Requirements:

- Node.js 22.13 or newer
- pnpm 11

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Create a production build:

```bash
pnpm build
```

## Environment variables

Copy `.env.example` to `.env.local` and provide the values required for the features you use.

### Access control

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `EDITOR_USERNAME`
- `EDITOR_PASSWORD`

### Repository-backed content

- `GITHUB_CONTENT_TOKEN`
- `CONTENT_REPOSITORY`
- `CONTENT_BRANCH`

The repository token should be fine-grained and limited to this repository with Contents read and write access.

### Editorial analysis

- `AI_GATEWAY_MODEL`

Vercel deployments authenticate the editorial analyzer through the platform's workload identity. The configured model must support structured text output.

### Contact and media integrations

- `CONTACT_CAPTCHA_SECRET`
- `BLOB_READ_WRITE_TOKEN`
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_BUSINESS_ACCOUNT_ID`

Keep all credentials in Vercel Environment Variables. Never commit secrets to the repository.

## Vercel deployment

The project uses the Next.js framework preset. Leave the Output Directory setting empty. `vercel.json` runs the native Next.js production build.

Pushing to `main` triggers a production deployment through the connected Git repository.

## Copyright and development credit

© 2026 Lebanese Forces. Website designed and developed by **Innovative Solutions**.
