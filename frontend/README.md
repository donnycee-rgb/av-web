# Frontend — public website

## Run it

```bash
cd frontend
npm install        # first time only
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
```

Deploy: on Netlify, set **Base directory** to `frontend` — `netlify.toml` handles the rest.

## Contact form (Netlify Forms)

The contact form (fill-in-the-script) sends through **Netlify Forms** — no backend needed.

- Submissions appear in the Netlify dashboard under **Forms → contact-script**. Add an email notification there so the studio gets each one in its inbox.
- `index.html` contains a hidden static copy of the form so Netlify can detect it at deploy time. If you add or rename a blank in `src/content/contact.ts`, update that copy too.
- In local development nothing is sent; the success screen says so.

## Folder guide

```
frontend/
├── public/                 Files served as-is (not processed by the build)
│   ├── images/             Logo, favicon, social share image
│   ├── videos/             Short background / hero loops
│   └── fonts/              Self-hosted fonts (if we don't use Google Fonts)
│
└── src/
    ├── app/                App entry, router (all routes defined here), global providers
    │
    ├── pages/              One folder per page — a page only assembles sections
    │   ├── home/           /
    │   ├── work/           /work
    │   ├── project/        /work/:slug
    │   ├── studio/         /studio
    │   ├── contact/        /contact
    │   └── not-found/      404
    │
    ├── components/
    │   ├── layout/         Header, Footer, mobile Menu, page shell
    │   ├── ui/             Small building blocks: Button, Heading, Section (rounded sheet), Tag
    │   ├── sections/       Big page blocks: Hero, FeaturedWork, Services, Clients, Results, CallToAction
    │   ├── media/          Anything that shows video/photos: ProjectCard, ProgramMonitor, Timeline…
    │   └── forms/          Form building blocks (the contact sentence blanks)
    │
    ├── content/            The site's text and project data (until the backend exists).
    │                       Editing copy = editing files here, never inside components.
    ├── hooks/              Reusable React hooks (e.g. scroll position, media queries)
    ├── lib/                Plain helpers: formatting, video URL helpers, later the API client
    ├── styles/             Global CSS, brand colours, fonts, spacing tokens
    ├── types/              Shared TypeScript types (Project, Service, Client…)
    └── assets/
        ├── images/         Images imported in code (optimised by the build)
        └── icons/          SVG icons
```

## Rules we follow

1. **Pages assemble, sections build, ui components are generic.** A section never imports a page.
2. **No copy inside components.** All text and project data come from `src/content/`.
3. **Brand values live in one place** (`src/styles/`). No hard-coded colours in components.
4. **One component per file.** If a file gets long, split it.
