import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    configured: Boolean(process.env.MP_ACCESS_TOKEN),
    node_version: process.version,
  });
}
