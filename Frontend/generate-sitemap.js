// generate-sitemap.js (ESM compatible)
import { createWriteStream } from 'fs';
import { SitemapStream } from 'sitemap';

const baseUrl = "https://smart-serve-coral.vercel.app";
const sitemap = new SitemapStream({ hostname: baseUrl });
const writeStream = createWriteStream('./public/sitemap.xml');
sitemap.pipe(writeStream);

// Static routes
const staticRoutes = [
  "/", 
  "/client",
  "/client/explore",
  "/client/chat",
  "/client/reviews",
  "/client/history",
  "/client/profile",
  "/client/settings",
  "/client/payment",
  "/service/profile",
  "/service/requests",
  "/service/chat",
  "/service/payments",
  "/service/reviews",
  "/service/membership"
];

// Dynamic sample data
const services = ["electrician", "plumber", "painter"];
const providerIds = ["123", "456", "789"];

(async () => {
  staticRoutes.forEach(url => {
    sitemap.write({ url, changefreq: "weekly", priority: 0.8 });
  });

  services.forEach(service => {
    sitemap.write({ url: `/client/explore/${service}`, changefreq: "weekly", priority: 0.85 });

    providerIds.forEach(id => {
      sitemap.write({ url: `/client/provider/${service}/${id}`, changefreq: "weekly", priority: 0.85 });
    });
  });

  sitemap.end();
})();
