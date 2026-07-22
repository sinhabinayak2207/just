# Nirav Patel Realtor Website

Standalone Vite + React site for Nirav Patel's personal realtor brand.

## Local Development

```bash
npm install
npm run dev
```

## CMS

Open `/admin/site-builder` to edit the site on a live canvas. All public landing text and image URLs are mapped through `src/lib/siteContent.js`, saved locally as a JSON draft, and can be exported/imported for migration to Supabase later.

## Vercel

Build command:

```bash
npm run build
```

Output directory:

```bash
dist
```
