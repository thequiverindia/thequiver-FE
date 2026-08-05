import { redirect } from 'next/navigation';

// No passwords exist to forget — Google sign-in only.
export default function ForgotPage() {
  redirect('/login');
}
