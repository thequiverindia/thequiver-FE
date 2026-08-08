import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';
import { revalidateTag } from 'next/cache';

/**
 * Publish-to-live pipeline: when a doc changes, invalidate the cache tags the
 * data layer reads (lib/data) so affected pages regenerate within seconds.
 *
 * Two rules learned the hard way:
 *
 * 1. Only invalidate tags that a cached query actually uses. Tags nothing
 *    consumes are dead code; worse, they create the illusion of freshness.
 *
 * 2. Taxonomy is DENORMALISED into other caches. Category labels, tag labels,
 *    author names/avatars and media URLs are all copied into the `articles`
 *    cache by lib/data's mappers. Editing one of those must therefore bust
 *    `articles` too, or the rename never reaches the site (unstable_cache
 *    defaults to a ONE YEAR ttl).
 *
 * Seed scripts pass context.disableRevalidate (no Next request context there).
 */

function bust(tags: string[]) {
  try {
    for (const t of tags) revalidateTag(t);
  } catch {
    // Outside a Next.js request (CLI, scripts) — nothing to invalidate.
  }
}

/**
 * @param tag           the collection's own cache tag
 * @param alsoBust      extra tags this collection is denormalised into
 * @param draftsMatter  when false (the default), draft-only saves are ignored.
 *                      Articles autosave every 3s; without this the entire
 *                      site cache is wiped continuously while an editor types.
 */
export const revalidateAfterChange =
  (
    tag: string,
    { alsoBust = [] as string[], draftsMatter = false } = {},
  ): CollectionAfterChangeHook =>
  ({ doc, previousDoc, req }) => {
    if (req.context?.disableRevalidate) return doc;

    if (!draftsMatter) {
      const isDraftNow = doc?._status === 'draft';
      const wasPublished = previousDoc?._status === 'published';
      // A draft save only matters if it just un-published something live.
      if (isDraftNow && !wasPublished) return doc;
    }

    bust([tag, ...alsoBust]);
    return doc;
  };

export const revalidateAfterDelete =
  (tag: string, { alsoBust = [] as string[] } = {}): CollectionAfterDeleteHook =>
  ({ doc, req }) => {
    if (req.context?.disableRevalidate) return doc;
    bust([tag, ...alsoBust]);
    return doc;
  };

/** For globals (Settings), which have no slug/status. */
export const revalidateGlobal =
  (tag: string) =>
  ({ doc, req }: { doc: unknown; req: { context?: Record<string, unknown> } }) => {
    if (req.context?.disableRevalidate) return doc;
    bust([tag]);
    return doc;
  };
