import { Clock, Eye, Calendar } from 'lucide-react';
import { cn, formatNumber, timeAgo } from '@/lib/utils';

export function MetaBar({
  publishedAt,
  readMinutes,
  views,
  className,
}: {
  publishedAt: string;
  readMinutes?: number;
  views?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted',
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="h-3 w-3" />
        {timeAgo(publishedAt)}
      </span>
      {readMinutes !== undefined && (
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          {readMinutes} min read
        </span>
      )}
      {views !== undefined && (
        <span className="inline-flex items-center gap-1.5">
          <Eye className="h-3 w-3" />
          {formatNumber(views)} views
        </span>
      )}
    </div>
  );
}
