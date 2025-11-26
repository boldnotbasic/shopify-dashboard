// Minimal serverless SEO scan endpoint (Node/Serverless)
// Expected deployment: any serverless (Vercel/Netlify/Cloudflare Functions via Node compat)
// POST JSON { url: string }
// Response JSON { h1Count, hasMetaDescription, totalImages, imagesWithoutAlt }

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');

const isValidUrl = (u) => {
  try {
    const parsed = new URL(u);
    if (!/^https?:$/.test(parsed.protocol)) return false;
    // Optional: more validation/whitelist here
    return true;
  } catch (_) {
    return false;
  }
};

// Vercel-style handler
module.exports = async (req, res) => {
  // CORS (adjust as needed)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body || {};
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid url' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const r = await fetch(url, { signal: controller.signal, redirect: 'follow' });
    clearTimeout(timeout);

    if (!r.ok) {
      return res.status(502).json({ error: `Upstream responded ${r.status}` });
    }

    const html = await r.text();
    const $ = cheerio.load(html);

    const h1Count = $('h1').length;
    const metaDesc = $('meta[name="description"]').attr('content') || '';
    const hasMetaDescription = metaDesc.trim().length > 0;

    const images = $('img');
    let imagesWithoutAlt = 0;
    images.each((_, el) => {
      const alt = $(el).attr('alt');
      if (typeof alt !== 'string' || alt.trim() === '') imagesWithoutAlt += 1;
    });

    res.status(200).json({ h1Count, hasMetaDescription, totalImages: images.length, imagesWithoutAlt });
  } catch (e) {
    const msg = e && e.message ? e.message : String(e);
    res.status(500).json({ error: msg });
  }
};
