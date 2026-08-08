/**
 * Repairs the founding staff account.
 *
 * Two problems it addresses:
 *   1. The email was created with a typo ("thequiveindia" — no 'r'), so the
 *      intended address fails to log in.
 *   2. The only account has role "editor". Users.create and role changes
 *      require "admin", so nobody can add staff or grant permissions.
 *
 * Run: npx tsx scripts/fix-admin-account.ts             (report only)
 *      npx tsx scripts/fix-admin-account.ts --write     (apply)
 */
import { getPayload } from 'payload';
import config from '../payload.config';

const CURRENT_EMAIL = 'thequiveindia@gmail.com';
const CORRECTED_EMAIL = 'thequiverindia@gmail.com';

async function main() {
  const write = process.argv.includes('--write');
  const payload = await getPayload({ config });

  const res = await payload.find({
    collection: 'users',
    where: { email: { equals: CURRENT_EMAIL } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const user = res.docs[0] as { id: number | string; email?: string; role?: string } | undefined;
  if (!user) {
    console.log(`No account found with email ${CURRENT_EMAIL} — nothing to do.`);
    process.exit(0);
  }

  console.log(`\nAccount #${user.id}`);
  console.log(`  email  ${user.email}  ->  ${CORRECTED_EMAIL}`);
  console.log(`  role   ${user.role}  ->  admin\n`);

  if (!write) {
    console.log('Dry run — pass --write to apply.');
    process.exit(0);
  }

  await payload.update({
    collection: 'users',
    id: user.id,
    data: { email: CORRECTED_EMAIL, role: 'admin' },
    // The role field is admin-only by design; this runs outside a request, so
    // there is no logged-in user for that check to pass against.
    overrideAccess: true,
  });

  console.log('Applied. The password is unchanged — sign in with the corrected email.');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
