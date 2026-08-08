/**
 * Lists admin accounts (no secrets printed) so a failing login can be told
 * apart from a missing account.
 *
 * Run: npx tsx scripts/list-admins.ts
 */
import { getPayload } from 'payload';
import config from '../payload.config';

async function main() {
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: 'users',
    limit: 100,
    depth: 0,
    overrideAccess: true,
  });

  console.log(`\n${res.totalDocs} user account(s):\n`);
  for (const u of res.docs as Array<{
    id: number | string;
    email?: string;
    role?: string;
    loginAttempts?: number;
    lockUntil?: string | null;
    createdAt?: string;
  }>) {
    const locked = u.lockUntil && new Date(u.lockUntil) > new Date();
    console.log(
      `  #${u.id}  ${u.email}` +
        `\n      role=${u.role ?? '(unset)'}  failedAttempts=${u.loginAttempts ?? 0}` +
        `  ${locked ? `LOCKED until ${u.lockUntil}` : 'not locked'}` +
        `\n      created=${u.createdAt}\n`,
    );
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
