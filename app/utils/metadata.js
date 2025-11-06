// app/utils/metadata.js

import axios from 'axios';

/**
 * Generates metadata dynamically.
 * @param {Object} options - Options for metadata
 * @param {string} options.slug - Page slug or identifier
 * @param {string} options.defaultTitle - Default title if slug not provided
 */
export async function generateMeta({ slug, defaultTitle = 'My Website' }) {
  let title = defaultTitle;
  let description = `Welcome to ${defaultTitle}`;
  let keywords = 'website, default';

  if (slug) {
    try {
      // Fetch metadata from backend if needed
      const res = await axios.get(`http://localhost:8000/api/metadata/${slug}`);
      if (res.data.success) {
        title = res.data.data.title || title;
        description = res.data.data.description || description;
        keywords = res.data.data.keywords || keywords;
      } else {
        // fallback if backend fails
        title = `Page - ${slug}`;
        description = `Content for ${slug}`;
        keywords = `page, ${slug}`;
      }
    } catch (err) {
      console.error('Error fetching metadata:', err);
      title = `Page - ${slug}`;
      description = `Content for ${slug}`;
      keywords = `page, ${slug}`;
    }
  }

  return {
    title,
    description,
    keywords,
  };
}
