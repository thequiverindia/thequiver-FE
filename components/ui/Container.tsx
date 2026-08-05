import { cn } from '@/lib/utils';

export function Container({
  className,
  children,
  as: Tag = 'div',
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return <Tag className={cn('container-page', className)}>{children}</Tag>;
}
