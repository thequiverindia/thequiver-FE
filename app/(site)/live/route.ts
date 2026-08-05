import { redirect } from 'next/navigation';

/** Live coverage is deferred to a later phase — old links land on the news index. */
export function GET() {
  redirect('/news');
}
