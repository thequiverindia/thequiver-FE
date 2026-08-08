import type { Field, FieldHook } from 'payload';

/**
 * A slug becomes a filename during the build (`<slug>.rsc`, `<slug>.html`…),
 * and Linux caps a single filename at 255 *bytes*. Devanagari costs 3 bytes per
 * character, so a ~100-character Hindi headline blows past that and fails the
 * build with ENAMETOOLONG — while building fine on Windows, which counts
 * characters instead. 180 bytes leaves room for every suffix Next appends and
 * still allows ~60 Devanagari or 180 Latin characters.
 */
export const SLUG_MAX_BYTES = 180;

/** True if this slug is short enough to be prerendered to a file. */
export const isPrerenderableSlug = (slug: string): boolean =>
  Buffer.byteLength(slug, 'utf8') <= SLUG_MAX_BYTES;

/** Cut to a byte budget on a word boundary so no word is left half-written. */
const truncateBytes = (val: string, max: number): string => {
  if (Buffer.byteLength(val, 'utf8') <= max) return val;

  let out = '';
  for (const char of val) {
    if (Buffer.byteLength(out + char, 'utf8') > max) break;
    out += char;
  }

  // Prefer ending at the last separator, but not if that throws away most of
  // the slug (a single very long word would leave almost nothing).
  const lastDash = out.lastIndexOf('-');
  if (lastDash > max / 2) out = out.slice(0, lastDash);

  return out.replace(/-+$/, '');
};

/**
 * Unicode-aware slugify — keeps Devanagari letters AND combining marks
 * (vowel signs like ा ि ी are \p{M}, not \p{L}) so Hindi slugs stay readable.
 */
export const slugify = (val: string): string =>
  truncateBytes(
    val
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, ''),
    SLUG_MAX_BYTES,
  );

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
