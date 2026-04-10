const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/300x300?text=No+Image';
  if (path.startsWith('http')) return path; // Cloudinary URL — as-is
  return `${BASE}${path.startsWith('/') ? path : '/' + path}`;
};