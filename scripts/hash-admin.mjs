#!/usr/bin/env node
/**
 * Generate SHA-256 hashes for VITE_ADMIN_USER_HASH / VITE_ADMIN_PASS_HASH
 * Usage: node scripts/hash-admin.mjs <username> <password>
 */
import { createHash } from 'crypto';

const [user, pass] = process.argv.slice(2);
if (!user || !pass) {
  console.error('Usage: node scripts/hash-admin.mjs <username> <password>');
  process.exit(1);
}

const hash = (s) => createHash('sha256').update(s).digest('hex');

console.log(`VITE_ADMIN_USER_HASH=${hash(user)}`);
console.log(`VITE_ADMIN_PASS_HASH=${hash(pass)}`);
