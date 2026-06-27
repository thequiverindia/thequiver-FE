import { Info, AlertTriangle, BookOpen } from 'lucide-react';
import type { ArticleBlock } from '@/lib/types';

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="prose-article with-dropcap">
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'p':
      return <p>{block.text}</p>;
    case 'h2':
      return <h2>{block.text}</h2>;
    case 'h3':
      return <h3>{block.text}</h3>;
    case 'quote':
      return (
        <blockquote>
          <p>"{block.text}"</p>
          {block.cite && (
            <footer className="mt-3 text-sm not-italic text-ink-subtle">
              — {block.cite}
            </footer>
          )}
        </blockquote>
      );
    case 'list':
      if (block.ordered) {
        return (
          <ol>
            {block.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ol>
        );
      }
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case 'image':
      return (
        <figure className="my-10">
          <div className="overflow-hidden rounded-lg bg-bg-muted">
            <img src={block.src} alt={block.caption ?? ''} className="w-full" />
          </div>
          {(block.caption || block.credit) && (
            <figcaption className="mt-2 text-xs text-ink-muted">
              {block.caption}
              {block.credit && <span className="ml-1 text-ink-subtle">— {block.credit}</span>}
            </figcaption>
          )}
        </figure>
      );
    case 'callout': {
      const meta = {
        info: {
          Icon: Info,
          classes: 'border-brand/20 bg-brand/5 text-ink',
          iconClasses: 'text-brand',
        },
        warn: {
          Icon: AlertTriangle,
          classes: 'border-saffron/20 bg-saffron/5 text-ink',
          iconClasses: 'text-saffron',
        },
        note: {
          Icon: BookOpen,
          classes: 'border-line bg-bg-subtle text-ink',
          iconClasses: 'text-ink-muted',
        },
      }[block.tone];
      return (
        <aside className={`my-8 flex gap-3 rounded-lg border p-5 ${meta.classes}`}>
          <meta.Icon className={`h-5 w-5 shrink-0 ${meta.iconClasses}`} />
          <p className="text-sm leading-relaxed">{block.text}</p>
        </aside>
      );
    }
    case 'stat':
      return (
        <div className="my-10 rounded-2xl border-l-4 border-saffron bg-bg-subtle px-6 py-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            {block.label}
          </p>
          <p className="mt-2 font-serif text-4xl font-semibold text-ink md:text-5xl">
            {block.value}
          </p>
          {block.sub && <p className="mt-2 text-sm text-ink-muted">{block.sub}</p>}
        </div>
      );
  }
}
