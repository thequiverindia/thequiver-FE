import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

/**
 * Renders the Lexical rich-text body from the CMS.
 * Typography comes from the .prose-article styles in globals.css, so the
 * reading experience is identical to the old block renderer.
 */
export function ArticleBody({ body }: { body: unknown }) {
  if (!body) return null;
  return (
    <div className="prose-article with-dropcap">
      <RichText data={body as SerializedEditorState} disableContainer />
    </div>
  );
}
