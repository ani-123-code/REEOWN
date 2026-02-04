const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Collection = require('../models/Collection');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://reeown.eco-dispose.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    const products = await Product.find({ stock: { $gt: 0 } }).select('_id updatedAt').lean();
    const collections = await Collection.find({ isActive: true }).select('slug name updatedAt').lean();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Homepage
    sitemap += `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    // Static pages
    const staticPages = [
      { path: '/products', priority: '0.9' },
      { path: '/about', priority: '0.8' },
      { path: '/contact', priority: '0.8' },
      { path: '/sell', priority: '0.8' },
      { path: '/repair', priority: '0.8' },
      { path: '/recycle', priority: '0.8' },
      { path: '/business', priority: '0.8' },
    ];

    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Collections
    collections.forEach(collection => {
      const slug = collection.slug || collection.name.toLowerCase().replace(/\s+/g, '-');
      const lastmod = collection.updatedAt ? new Date(collection.updatedAt).toISOString().split('T')[0] : currentDate;
      sitemap += `
  <url>
    <loc>${baseUrl}/products/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Products
    products.forEach(product => {
      const lastmod = product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : currentDate;
      sitemap += `
  <url>
    <loc>${baseUrl}/product/${product._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    res.set('Content-Type', 'text/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
