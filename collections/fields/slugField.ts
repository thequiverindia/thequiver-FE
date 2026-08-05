import type { Field, FieldHook } from 'payload';

/**
 * Unicode-aware slugify — keeps Devanagari letters AND combining marks
 * (vowel signs like ा ि ी are \p{M}, not \p{L}) so Hindi slugs stay readable.
 */
export const slugify = (val: string): string =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value);
    const fallback = data?.[fallbackField];
    if (typeof fallback === 'string' && fallback.length > 0) return slugify(fallback);
    return value;
  };

/** Standard slug field: unique, indexed, auto-generated from another field. */
export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL path — leave empty to auto-generate',
  },
  hooks: {
    beforeValidate: [formatSlug(from)],
  },
});
