import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const token = process.env.MP_ACCESS_TOKEN;
  res.status(200).json({
    token_exists: !!token,
    token_prefix: token ? token.substring(0, 10) + '...' : null,
    node_version: process.version,
  });
}
