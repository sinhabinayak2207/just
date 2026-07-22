# Nirav Patel Realtor Website

Standalone Vite + React site for Nirav Patel's personal realtor brand.

## Local Development

```bash
npm install
npm run dev
```

## CMS

Open `/admin/site-builder` to edit the site on a live canvas. All public landing text and image URLs are mapped through `src/lib/siteContent.js`; the deployed site loads content from Supabase through `/api/admin/content`.

Run `supabase.sql` in the Supabase SQL Editor, then add these Vercel environment variables:

```bash
SUPABASE_URL=https://nbixlxzzjfmjbmslivgq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-rotated-service-role-key
SUPABASE_CONTENT_TABLE=site_content
SUPABASE_CONTENT_KEY=landing
SUPABASE_STORAGE_BUCKET=site-assets
CMS_ADMIN_PASSWORD=your-strong-editor-password
```

The CMS password unlocks save/upload from the canvas. The service role key is only used inside Vercel serverless functions and must not be exposed in browser code.

## Vercel

Build command:

```bash
npm run build
```

Output directory:

```bash
dist
```
