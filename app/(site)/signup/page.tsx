import { redirect } from 'next/navigation';

// One auth screen for everything — Google handles new and returning users alike.
export default function SignupPage() {
  redirect('/login');
}
