/**
 * One-time setup: reset demo account passwords and sync pet tag IDs.
 * Run: node scripts/setup-db.js
 */
import bcrypt from 'bcryptjs';
import db from '../db.js';

const DEMO_PASSWORD = 'Password123';

async function main() {
  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await db.query('UPDATE users SET password = ?', [hash]);
  console.log(`✅ All user passwords reset to: ${DEMO_PASSWORD}`);

  await db.query(`
    UPDATE pets p
    JOIN nfc_tags nt ON nt.pet_id = p.id AND nt.status = 'active'
    SET p.tag_id = nt.tag_uid
    WHERE p.tag_id IS NULL OR p.tag_id = ''
  `);
  console.log('✅ Pet tag_id values synced from nfc_tags');

  const [users] = await db.query('SELECT email, role FROM users ORDER BY id');
  console.log('\nDemo accounts:');
  users.forEach(u => console.log(`  ${u.email} (${u.role})`));

  process.exit(0);
}

main().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
