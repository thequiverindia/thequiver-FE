import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';
import { revalidateTag } from 'next/cache';

/**
 * Publish-to-live pipeline: whenever a doc changes, invalidate its cache
 * tags so the affected pages regenerate within seconds — no redeploy.
 *
 * Frontend fetches (Milestone 3) tag their queries with:
 *   `<collection>`        e.g. "articles"      → lists, homepage
 *   `<collection>:<slug>` e.g. "articles:xyz"  → the detail page
 *
 * Seed scripts pass context.disableRevalidate (no Next request context there).
 */
export const revalidateAfterChange =
  (tag: string): CollectionAfterChangeHook =>
  ({ doc, previousDoc, req }) => {
    if (req.context?.disableRevalidate) return doc;
    try {
      revalidateTag(tag);
      if (doc?.slug) revalidateTag(`${tag}:${doc.slug}`);
      // If the slug changed, the old URL must also refresh (to 404).
      if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
        revalidateTag(`${tag}:${previousDoc.slug}`);
      }
    } catch {
      // Running outside a Next.js request (CLI, scripts) — nothing to invalidate.
    }
    return doc;
  };

export const revalidateAfterDelete =
  (tag: string): CollectionAfterDeleteHook =>
  ({ doc, req }) => {
    if (req.context?.disableRevalidate) return doc;
    try {
      revalidateTag(tag);
      if (doc?.slug) revalidateTag(`${tag}:${doc.slug}`);
    } catch {}
    return doc;
  };
