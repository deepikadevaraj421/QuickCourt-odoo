// Creates/updates the single ADMIN account from env vars. Admin signup is
// intentionally not exposed through the public API.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

async function main() {
  const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'QuickCourt Admin';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in backend/.env');
  }
  if (password.length < 8) throw new Error('ADMIN_PASSWORD must be at least 8 characters');

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role: 'ADMIN', isVerified: true },
    create: { name, email, passwordHash, role: 'ADMIN', isVerified: true }
  });
  console.log(`Admin account ready: ${admin.email}`);
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
